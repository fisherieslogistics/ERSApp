'use strict';
import {
  View,
  AlertIOS,
  Text,
} from 'react-native';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventDetailEditor from './EventDetailEditor';
import PlaceholderMessage from '../common/PlaceholderMessage';
import FishingEventCatchesEditor from './FishingEventCatches';
import styles from './FishingStyle';
import { LongButton } from '../common/Buttons';
import { colors } from '../../styles/styles';

import {
  changeItemInEvent,
  deleteItemInEvent,
  addItemToEvent,
  commitFishingEvent,
} from '../../actions/FishingEventActions';

import { setSelectedFishingDetail } from '../../actions/ViewActions';

const toBind = [
  'renderDetailViewButtons',
  'setSelectedDetail',
  'addItem',
  'deleteItem',
  'changeItem',
];

const addButtonProps = { text: "Add", color: colors.green, wrapstyle: { flex: 0.20 }  }

class EventEditor extends Component {

  constructor (props){
    super(props);
    toBind.forEach(funcName => {this[funcName] = this[funcName].bind(this)});
  }

  isDetailSelected(choice) {
    return choice === this.props.selectedCatchesDetail;
  }

  addItem(eventAttribute) {
    console.log(eventAttribute);
  }

  changeItem(eventAttribute, inputId, value, item) {
    console.log(eventAttribute);
  }

  deleteItem(eventAttribute, item) {
    console.log(item);
  }

  renderDetailEditor() {
    switch (this.props.selectedDetail) {
      case "catches":
      case "protecteds":
      case "discards":
        return (
          <FishingEventCatchesEditor
            selectedDetail={ this.props.selectedDetail }
            addItem={ this.addItem }
            changeItem={ this.changeItem }
            deleteItem={ this.deleteItem }
            species={ this.props.species }
          />
        );
      default:
        return (
          <EventDetailEditor />
       );
    }
  }

  renderAddButton(eventAttribute, enabled){
    const onPress = () => this.addItem(eventAttribute);
    const btnProps = {
      ...addButtonProps,
      onPress,
      active: enabled,
      enabled,
    };
    return this.renderButton(btnProps);
  }

  setSelectedDetail(selectedDetail) {
    this.props.dispatch(setSelectedFishingDetail(selectedDetail));
  }

  renderDetailViewButton(error, detailName, enabled = true){
    return this.renderButton({
      text: detailName.capitalize(),
      onPress: () => this.setSelectedDetail(detailName),
      color: colors.blue,
      wrapstyle: {
        flex: 0.30,
      },
      enabled,
      active: this.props.selectedDetail === detailName
    });
  }

  renderButton({ text, onPress, color, wrapstyle, active, enabled }) {
    const opacStyle = { opacity: enabled ? 1 : 0.35 };
    return (
      <View style={ [wrapstyle, opacStyle] } key={`_eventEditor_${text}_button`}>
        <LongButton
          bgColor={ color }
          text={ text.capitalize() }
          active={ active }
          disabled={ !enabled }
          onPress={ onPress }
        />
      </View>
    );
  }

  renderDetailViewButtons() {
    const { viewingEvent } = this.props;
    const { committed, datetimeAtEnd } = viewingEvent.eventValues;
    const catchesEnabled = !!datetimeAtEnd;

    return [
      this.renderDetailViewButton((catchesEnabled), 'detail', true, 0),
      this.renderDetailViewButton(false, 'catches', catchesEnabled),
      this.renderSubmitButton(catchesEnabled && !committed && viewingEvent.detailsValid),
      (<View key={'33'} style={{ padding: 15 }}>
        <Text style={{fontSize:  22, color: colors.green}}>
          { `Shot# ${viewingEvent.eventValues.numberInTrip}` }
        </Text>
      </View>),
    ];
  }

  submitEvent = async () => {
    AlertIOS.alert(
      "Save and Commit This Event",
      'Have you entered all details and catches for this event?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: "I'm Ready to save.", onPress: async () => {
          const appState = await this.props.db.get('AppStateLocalStatus');
          this.props.db.update({ committed: true, documentReady: true, vesselNumber: appState.vessel.registration }, this.props.viewingEvent._id);
          this.props.fishCatches.forEach((fc) => {
            this.props.db.update({ documentReady: true }, fc._id);
          });
        }}
      ]
    );
  }

  renderSubmitButton(enabled) {
    return this.renderButton({
      text: 'SAVE',
      onPress: () => enabled && this.submitEvent(),
      color: colors.red,
      wrapstyle: {
        flex: 0.30,
      },
      enabled,
      active: !!enabled,
    });
  }

  renderMessage(message){
    const style = { padding: 15, marginTop: 30, flex: 1, height: 180 };
    return (
      <View style={style}>
        <PlaceholderMessage
          text={message}
          height={this.props.height}
        />
      </View>
    );
  }

  render(){
    const { viewingEvent, selectedDetail } = this.props;
    if(!viewingEvent) {
      return null;
    }
    const { datetimeAtEnd, committed } = viewingEvent.eventValues;
    if(committed) {
      return this.renderMessage("Shot has been signed off and cannot be edited");
    }
    let detailAttribute = selectedDetail;
    if(selectedDetail === 'catches') {
      detailAttribute = 'estimatedCatch';
    }
    const canAdd = ['protecteds', 'discards'].includes(selectedDetail);
    const addButton = null;
    this.renderAddButton(detailAttribute, !!(canAdd && datetimeAtEnd));
    const detailView = this.renderDetailEditor();
    const viewButtons = this.renderDetailViewButtons();
    const detailRowStyle = [];

    return(
      <View style={ [styles.fill, styles.col] }>
        <View style={[styles.row, { flex: 0.06 }] }>

          { viewButtons }
          { addButton }

        </View>
        <View style={ [styles.row, { flex: 0.94, paddingTop: 15 } ] }>

          { detailView }

        </View>
      </View>
    );
  }

}

const select = (state) => {
  const props = {
    fishingEventsUpdated: state.fishingEvents.lastUpdated,
    viewingEvent: state.fishingEvents.viewingEvent,
    selectedDetail: state.view.selectedFishingDetail,
    lastUpdated: state.view.lastUpdated,
    db: state.database.db,
    fishCatches: state.fishingEvents.viewingFishCatches,
    species: state.species.all,
  };
  return props;
}

export default connect(select)(EventEditor);
