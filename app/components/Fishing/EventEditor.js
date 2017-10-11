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
  changeItemInEvent,
  deleteItemInEvent,
  addItemToEvent,
  commitFishingEvent,
} from '../../actions/FishingEventActions';

import { createFishingEvent } from '../../api/RestApi';
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
    console.log(eventAttribute);
    //this.props.dispatch(addItemToEvent(this.props.viewingEvent, eventAttribute));
  }

  changeItem(eventAttribute, inputId, value, item) {
    console.log(eventAttribute);
    /*const { code, weightKgs } = item;
    const changes = Object.assign({}, { code, weightKgs }, { [inputId]: value});
    this.props.dispatch(changeItemInEvent(this.props.viewingEvent, item, changes, eventAttribute));
    if(eventAttribute === 'estimatedCatch' && inputId === 'code' &&
      this.props.viewingEvent.shouldAddEmptyCatch) {
      this.addItem(eventAttribute);
    }*/
  }

  deleteItem(eventAttribute, item) {
    console.log(item);
    //this.props.dispatch(deleteItemInEvent(this.props.viewingEvent, item, eventAttribute));
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
    const { viewingEvent, viewingEventHelper } = this.props;
    const catchesEnabled = !!viewingEvent.datetimeAtEnd;
    return [
      this.renderDetailViewButton((catchesEnabled && !viewingEventHelper.detailsValid), 'detail', true, 0),
      this.renderDetailViewButton(false, 'catches', catchesEnabled, ''/*fEvent.estimatedCatch.length - 1*/),
      //this.renderDetailViewButton(!fEvent.discardsValid, 'discards', catchesEnabled, fEvent.discards.length),
      //this.renderDetailViewButton(false, 'protecteds', catchesEnabled, fEvent.protecteds.length),
      this.renderSubmitButton(),
    ];
  }

  renderSubmitButton() {
    const { canSubmit } = this.props.viewingEvent;
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
          this.props.db.update({ committed: true }, this.props.viewingEvent._id);
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
    const { viewingEvent, selectedDetail, viewingEventHelper } = this.props;
    if(!viewingEvent) {
      return null;
    }
    const { datetimeAtEnd, committed } = viewingEvent;
    if(committed) {
      return this.renderMessage("Shot has been signed off and cannot be edited");
    }
    let detailAttribute = selectedDetail;
    if(selectedDetail === 'catches') {
      detailAttribute = 'estimatedCatch';
    }
    const canAdd = this.props.selectedDetail !== 'detail';
    const addButton = this.renderAddButton(detailAttribute, !!(datetimeAtEnd && canAdd));
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
  const props = {
    fishingEventsUpdated: state.fishingEvents.lastUpdated,
    viewingEvent: state.fishingEvents.viewingEventHelper,
    viewingEventHelper: state.fishingEvents.viewingEventHelper,
    selectedDetail: state.view.selectedFishingDetail,
    lastUpdated: state.view.lastUpdated,
    db: state.database.db,
    fishCatches: state.fishingEvents.viewingFishCatches,
    species: state.species.all,
  };
  return props;
}

export default connect(select)(EventEditor);
