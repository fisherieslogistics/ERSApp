'use strict';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModelEditor from '../common/ModelEditor';
import { updateFishingEvent, toggleOptionalFields } from '../../actions/FishingEventActions';
import PlaceholderMessage from '../common/PlaceholderMessage';
import Validator from '../../utils/Validator';
import { colors } from '../../styles/styles';
import FishingEventModel from '../../models/FishingEventModel';

/* eslint-disable */
import speciesCodesDesc from '../../constants/species/speciesDesc';
/* eslint-enable */

class EventDetailEditor extends Component{

  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.getEditorProps = this.getEditorProps.bind(this);
    this.renderToggleShowMore = this.renderToggleShowMore.bind(this);
    this.toggleOptionalFields = this.toggleOptionalFields.bind(this);
    this.state = {};
  }

  toggleOptionalFields = () => {
    this.setState({ hideOptionalFields: !this.state.hideOptionalFields })
  }

  shouldCombineDepths(bottomDepth, groundropeDepth) {
    const bottomDepthValid = Validator.valid.greaterThanZero.func(bottomDepth);
    const groundropeDepthValid = Validator.valid.greaterThanZero.func(groundropeDepth);
    return bottomDepthValid && !groundropeDepthValid;
  }

  onChange(name, value, type) {
    const changes = { [name]: value };
    const { fishingEvent, db } = this.props;
    if(FishingEventModel.find((field) => field.id === name)) {
      db.update(changes, fishingEvent._id);
    } else {
      const eventDetails = fishingEvent.eventSpecificDetails;
      eventDetails[name] = value;
      const specificChanges = { eventSpecificDetails: JSON.stringify(eventDetails) };
      db.update(specificChanges, fishingEvent._id);
    }

  }

  getEditorProps(attribute){
    const extraProps = {};
    const { fishingEvent } = this.props;
    const inputId = `${attribute.id}_${fishingEvent._id}`;
    if(attribute.id === 'targetSpecies_id') {
      extraProps.autoCapitalize = 'characters';
      extraProps.maxLength = 3;
    }
    if(attribute.type === 'datetime') {
      extraProps.alwaysShowError = true;
    }

    return {
      attribute,
      extraProps,
      inputId,
      fishingEvent: fishingEvent.eventValues,
    };
  }

  renderMessage(message){
    return (
      <PlaceholderMessage
        text={message}
        height={this.props.height}
      />);
  }

  renderToggleShowMore(enabled){
    const viewStyle = {position: 'absolute', right: 0, top: -15, height: 30, width: 65};
    const textStyle = {fontSize: 26, color: enabled ? colors.green : colors.midGray };
    return (
      <TouchableOpacity
        style={viewStyle}
        onPress={ enabled ? this.toggleOptionalFields : null }
      >
        <View>
          <Text style={textStyle}>
            { this.state.hideOptionalFields ? 'More' : 'Less' }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { fishingEvent, trip, hideOptionalFields } = this.props;
    const { eventValues } = fishingEvent;
    if(!fishingEvent) {
      return this.renderMessage("No shots to edit");
    }

    if(!trip.values().active) {
      return this.renderMessage("Start Trip First");
    }

    const showMore = this.renderToggleShowMore(!!fishingEvent);
    const spacer = { height: 65 };
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 140 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
        style={{ padding: 6 }}
      >
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ fishingEvent.fieldsToRender(this.state.hideOptionalFields) }
          index={ eventValues.numberInTrip }
          modelValues={ eventValues }
          onChange={ this.onChange }
        />
        { showMore }
    </KeyboardAwareScrollView>);
  }
}

const select = (state) => {
  const props = {
    fishingEvent: state.fishingEvents.viewingEvent,
    trip: state.trip.currentTrip,
    viewLastUpdated: state.view.lastUpdated,
    fishingEventUpdated: state.fishingEvents.lastUpdated,
    species: state.species.all,
    db: state.database.db,
  };
  return props;
}

export default connect(select)(EventDetailEditor);
