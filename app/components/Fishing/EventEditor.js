'use strict';
import {
  View,
  AlertIOS,
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
  getRecord,
} from '../../database/RealmHelper';
import {
  changeItemInEvent,
  deleteItemInEvent,
  addItemToEvent,
  commitFishingEvent,
} from '../../actions/FishingEventActions';

import { setSelectedFishingDetail } from '../../actions/ViewActions';

const toBind = [
  'renderDetailViewButtons',
  'renderSubmitButton',
  'setSelectedDetail',
  'addItem',
  'deleteItem',
  'changeItem',
  'commit',
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
    this.props.dispatch(addItemToEvent(this.props.fishingEvent, eventAttribute));
  }

  changeItem(eventAttribute, inputId, value, item) {
    const { code, amount } = item;
    const changes = Object.assign({}, { code, amount }, { [inputId]: value});
    this.props.dispatch(changeItemInEvent(this.props.fishingEvent, item, changes, eventAttribute));
    if(eventAttribute === 'estimatedCatch' && inputId === 'code' &&
      this.props.fishingEvent.shouldAddEmptyCatch) {
      this.addItem(eventAttribute);
    }
  }

  deleteItem(eventAttribute, item) {
    this.props.dispatch(deleteItemInEvent(this.props.fishingEvent, item, eventAttribute));
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

  getButtonLabel(label, count) {
    return label;//count > 0 ? `${label}(${count})` : label;
  }

  renderDetailViewButton(error, detailName, enabled = true, count){
    return this.renderButton({
      text: this.getButtonLabel(detailName.capitalize(), count),
      onPress: () => this.setSelectedDetail(detailName),
      color: colors.blue,
      wrapstyle: {
        flex: 0.20
      },
      hasError: error && enabled, enabled,
      active: this.props.selectedDetail === detailName
    });
  }

  renderButton({ text, onPress, color, wrapstyle, hasError, active, enabled }) {
    const opacStyle = { opacity: enabled ? 1 : 0.35 };
    return (
      <View style={ [wrapstyle, opacStyle] } key={`_eventEditor_${text}_button`}>
        <LongButton
          bgColor={ color }
          text={ text.capitalize() }
          active={ active }
          disabled={ !enabled }
          onPress={ onPress }
          error={ hasError }
        />
      </View>
    );
  }

  renderDetailViewButtons() {
    const fEvent = this.props.fishingEvent;
    const catchesEnabled = !!fEvent.RAEnd_date;
    return [
      this.renderDetailViewButton((catchesEnabled && !fEvent.detailsValid), 'detail', true, 0),
      this.renderDetailViewButton(!fEvent.estimatedCatchValid, 'catches', catchesEnabled, fEvent.estimatedCatch.length - 1),
      this.renderDetailViewButton(!fEvent.discardsValid, 'discards', catchesEnabled, fEvent.discards.length),
      this.renderDetailViewButton(false, 'protecteds', catchesEnabled, fEvent.protecteds.length),
      this.renderSubmitButton(),
    ];
  }

  renderSubmitButton() {
    const { canSubmit } = this.props.fishingEvent;
    const sty = { flex: 0.20, opacity: canSubmit ? 1 : 0.35 }
    return (
      <View style={ sty } key={`_eventEditor_submit_button`}>
        <LongButton
          bgColor={ colors.blue }
          text={ 'submit' }
          active={ canSubmit }
          disabled={ !canSubmit }
          onPress={ this.commit }
          error={ false }
        />
      </View>
    );
  }

  commit() {
    AlertIOS.alert(
      "Commit",
      'Commit This Event Now?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Commit', onPress: () => {
          this.props.dispatch(commitFishingEvent(this.props.fishingEvent));
        }}
      ]
    );
  }

  renderMessage(message){
    const style = { padding: 15, marginTop: 30, flex: 1 };
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
    if(!this.props.fishingEvent) {
      return null;
    }
    if(this.props.fishingEvent.completed || this.props.fishingEvent.committed) {
      return this.renderMessage("Shot has been signed off and cannot be edited");
    }
    const { RAEnd_date } = this.props.fishingEvent;
    let detailAttribute = `${this.props.selectedDetail}`;
    if(detailAttribute === 'catches') {
      detailAttribute = 'estimatedCatch';
    }
    const catchesEnabled = !!RAEnd_date;
    const canAdd = this.props.selectedDetail !== 'detail';
    const addButton = this.renderAddButton(detailAttribute, !!(catchesEnabled && canAdd));
    const detailView = this.renderDetailEditor();
    const viewButtons = this.renderDetailViewButtons();
    const wrapper = [styles.detailView, styles.col];
    const detailRowStyle = [styles.row, styles.fill, styles.detailWrap];

    return(
      <View style={ wrapper }>
        <View style={ styles.row }>
          <View style={ styles.buttonRowStyle }>

            { viewButtons }
            { addButton }

          </View>
        </View>
        <View style={ detailRowStyle }>

          { detailView }

        </View>
      </View>
    );
  }

}

const select = (state) => {
  let fishingEvent = null;
  if(state.view.viewingEventId){
    fishingEvent = getRecord('fishingEvent', state.view.viewingEventId);
  }
  const props = {
    fishingEventsUpdated: state.fishingEvents.lastUpdated,
    fishingEvent,
    selectedDetail: state.view.selectedFishingDetail,
    lastUpdated: state.view.lastUpdated,
  };
  return props;
}

export default connect(select)(EventEditor);
