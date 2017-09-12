'use strict';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {inputStyles, colors} from '../../styles/styles';
import FLRadioButton from '../common/FLRadioButton';
import { RadioButtons } from 'react-native-radio-buttons';
import Helper from '../../utils/Helper';
import InputView from './InputView';
import { updateFishingEvent } from '../../actions/FishingEventActions';


const styles = StyleSheet.create({
  coordLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.blue,
  },
  formWrapper: {
    flex: 1,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    paddingRight: 5,
  },
  formSectionTop: {
    flex: 0.15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSectionMid: {
    flex: 0.35,
  },
  formSectionBottom: {
    flex: 0.4,
    padding: 5,
  },
  radioButtons: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 80
  },
});

class CoordinateEditor extends Component {

  constructor(props) {
    super(props);
    this.onHemisphereChange = this.onHemisphereChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  editorProps(coordType){
    const coordTypes = ['lat', 'lon'];
    if(coordTypes.indexOf(coordType) === -1){
      throw new Error(`prop coordType must be one of ${JSON.stringify(coordTypes)} but got ${coordType}`);
    }
    const hemispheres = {
      lat: {
        negative: 'South',
        positive: 'North',
      },
      lon: {
        negative: 'West',
        positive: 'East',
      }
    };
    const maxDegrees = {
      lat: 90,
      lon: 180,
    }
    return {
      label: coordType.charAt(0).toUpperCase() + coordType.slice(1),
      prepend: coordType.slice(0, 3),
      maxMinutes: 60,
      maxSeconds: 60,
      hemisphereOptions: [ hemispheres[coordType].positive, hemispheres[coordType].negative ],
      maxDegrees: maxDegrees[coordType],
    };
  }

  onChange(key, value=0) {
    if(isNaN(value)) {
      return;
    }
    const newLocation = Object.assign({}, this.props.location);
    const degMin = Helper.getDegreesMinutesFromLocation(newLocation);
    degMin[key] = value;
    const parsedLocation = Helper.parseLocation(degMin, degMin.ew, degMin.ns);
    const changes = {}
    changes[this.props.attribute.id] = Helper.locationToGeoJSONPoint(parsedLocation);
    this.props.dispatch(updateFishingEvent(this.props.fishingEvent, changes));
  }

  renderInputs(editorProps){
    return ['Degrees', 'Minutes', 'Seconds'].map((part, i) => {
      const attributeName = `${editorProps.prepend}${part}`;
      return (
        <InputView
          key={ `${attributeName}_${i}_part` }
          name={ attributeName }
          index={i}
          label={ part }
          maxVal={ editorProps[`max${part}`] }
          onChange={ this.onChange }
          attribute={ this.props.attribute }
          location={ this.props.location }
          coordType={ this.props.coordType }
        />
      );
    });
  }

  onHemisphereChange(val){
    const degMin = Helper.getDegreesMinutesFromLocation(this.props.location);
    let loc;
    switch (this.props.coordType) {
      case 'lat':
        loc = Helper.parseLocation(degMin, degMin.ew, val);
        break;
      case 'lon':
        loc = Helper.parseLocation(degMin, val, degMin.ns);
        break;
    }
    const changes = {};
    changes[this.props.attribute.id] = Helper.locationToGeoJSONPoint(loc);
    this.props.dispatch(updateFishingEvent(this.props.fishingEvent, changes));
  }

  renderRadioButton(text, selected, onSelect, index) {
    return (
      <FLRadioButton
        key={`${text}${index}`}
        text={ text }
        selected={ selected }
        onSelect={ onSelect }
        index={ index }
      />
    );
  }

  render() {
    const _props = this.editorProps(this.props.coordType, this.props.location);
    const degMin = Helper.getDegreesMinutesFromLocation(this.props.location);
    const hemisphere = this.props.coordType === 'lat' ? degMin.ns : degMin.ew;
    return (
      <View
        style={ [styles.formWrapper] }
        key={ 'coords_edit_' + this.props.label }
      >
        <View style={ [styles.formSectionTop] }>
          <Text style={[inputStyles.labelText, styles.coordLabel ]}>
            { _props.label }
          </Text>
        </View>
        <View style={ [styles.formSectionMid] }>
          { this.renderInputs(_props) }
        </View>
        <View style={ [styles.formSectionBottom] }>
          <View style={ styles.radioButtons }>
            <RadioButtons
              options={ _props.hemisphereOptions }
              onSelection={ this.onHemisphereChange }
              renderContainer={ RadioButtons.renderHorizontalContainer }
              renderOption={ this.renderRadioButton }
              selectedOption={ hemisphere }
            />
          </View>
        </View>
      </View>
    );
  }
}

const select = (state) => (
  {
    lastUpdated: state.fishingEvents.lastUpdated,
    fishingEvent: state.fishingEvents.viewingEvent,//getRecord('fishingEvent', state.view.viewingEventId),
  }
);

export default connect(select)(CoordinateEditor);
