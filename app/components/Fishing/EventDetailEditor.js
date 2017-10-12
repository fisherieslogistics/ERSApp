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
//import { getRenderableTrawlEventDetailModel } from '../../utils/ModelUtils';


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
  }

  toggleOptionalFields() {
    this.props.dispatch(toggleOptionalFields());
  }

  onChange(name, value, type){
    this.onChangeText(name, value);
  }

  shouldCombineDepths(bottomDepth, groundropeDepth) {
    const bottomDepthValid = Validator.valid.greaterThanZero.func(bottomDepth);
    const groundropeDepthValid = Validator.valid.greaterThanZero.func(groundropeDepth);
    return bottomDepthValid && !groundropeDepthValid;
  }

  onChangeText(name, value, type) {
    const changes = { [name]: value };
    const { fishingEvent } = this.props;

    /*if(!this.props.showOptionalFields && name === 'bottomDepth') {
      if(this.shouldCombineDepths(value, fishingEvent.groundropeDepth)) {
        changes.groundropeDepth = value;
      }
    }*/

    if(FishingEventModel.find((field) => field.id === name)){
      this.props.db.update(changes, fishingEvent._id);
    } else {
      const eventDetails = JSON.parse(fishingEvent.eventSpecificDetails);
      eventDetails[name] = value;
      const specificChanges = { eventSpecificDetails: JSON.stringify(eventDetails) };
      this.props.db.update(specificChanges, fishingEvent._id);
    }
  
  }

  getEditorProps(attribute){
    const extraProps = {};
    const inputId = `${attribute.id}_${this.props.fishingEvent._id}`;
    if(attribute.id === 'targetSpecies') {
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
      fishingEvent: this.props.viewingEventHelper,
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
    const viewStyle = {position: 'absolute', right: 0, top: 0, height: 30, width: 65};
    const textStyle = {fontSize: 22, color: enabled ? colors.green : colors.midGray };
    return (
      <TouchableOpacity
        style={viewStyle}
        onPress={ enabled ? this.toggleOptionalFields : null }
      >
        <View>
          <Text style={textStyle}>
            { this.props.showOptionalFields ? 'Less' : 'More' }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { fishingEvent, trip, showOptionalFields, viewingEventHelper } = this.props;

    if(!fishingEvent) {
      return this.renderMessage("No shots to edit");
    }

    if(!trip.started) {
      return this.renderMessage("Start Trip First");
    }

    //const fieldsToRender = getRenderableTrawlEventDetailModel(fishingEvent, showOptionalFields);



    const showMore = this.renderToggleShowMore(!!fishingEvent);

    const spacer = { height: 50 };
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 150 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
        style={{ padding: 6 }}
      >
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ viewingEventHelper.fieldsToRender() }
          index={ fishingEvent.numberInTrip }
          modelValues={ viewingEventHelper }
          onChange={ this.onChange }
        />
        { showMore }
    </KeyboardAwareScrollView>);
  }
}

const select = (state) => {
  const props = {
    fishingEvent: state.fishingEvents.viewingEvent,
    viewingEventHelper: state.fishingEvents.viewingEventHelper,
    trip: state.trip.currentTrip,
    viewLastUpdated: state.view.lastUpdated,
    fishingEventUpdated: state.fishingEvents.lastUpdated,
    showOptionalFields: state.fishingEvents.showOptionalFields,
    species: state.species.all,
    db: state.database.db,
  };
  return props;
}

export default connect(select)(EventDetailEditor);
