'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventDiscardsEditor from './EventDiscardsEditor';
import EventProductsEditor from './EventProductsEditor';
import EventProtectedsEditor from './EventProtectedsEditor';
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';


class FishingEventCatchesEditor extends Component {

  addItem(eventAttribute) {
    this.props.dispatch(addItemToEvent(this.props.viewingEvent, eventAttribute));
  }

  changeItem = (eventAttribute, inputId, value, item) => {
    const { code, weightKgs } = item;
    const changes = Object.assign({}, { code, weightKgs }, { [inputId]: value});
    if(changes.code === item.code && item.weightKgs === changes.weightKgs) {
      return;
    }
    if(item._id) {
      this.props.db.update(changes, item._id);
    } else {
      changes.fishingEvent_id = this.props.viewingEvent._id;
      changes.document_type = 'fishCatch';
      this.props.db.create(changes);
    }
    /*this.props.dispatch(changeItemInEvent(this.props.viewingEvent, item, changes, eventAttribute));
    if(eventAttribute === 'estimatedCatch' && inputId === 'code' &&
      this.props.viewingEvent.shouldAddEmptyCatch) {
      this.addItem(eventAttribute);
    }*/
  }

  deleteItem(eventAttribute, item) {
    this.props.db.delete();
  }

  render() {

    const {
      viewingEvent,
      dispatch,
      species,
      fishCatches,
      viewLastUpdated,
      viewingFishCatches,
      selectedDetail,
    } = this.props;

    const props = {
      fishingEvent: viewingEvent,
      deleteItem: this.deleteItem,
      addItem: this.addItem,
      changeItem: this.changeItem,
      species: species,
    }

    switch (this.props.selectedDetail) {
      case "catches":
        return (
          <EventProductsEditor
            {...props}
            model={ ProductModel }
            dispatch={ dispatch }
            items={ viewingFishCatches }
            viewLastUpdated={ viewLastUpdated }
          />
      );
      /*case "discards":
        return (
          <EventDiscardsEditor
            { ...props }
            model={ DiscardModel }
            items={ /*this.props.viewingEvent.discards }
            viewLastUpdated={ this.props.viewLastUpdated }
          />
        );
      case "protecteds":
        return (
          <EventProtectedsEditor
            { ...props }
            model={ ProtectedModel }
            items={ this.props.viewingEvent.protecteds }
            viewLastUpdated={ this.props.viewLastUpdated }
          />
        );*/
    }
  }
}

const select = (state) => {
  return {
    lastUpdated: state.fishingEvents.lastUpdated,
    viewingEvent: state.fishingEvents.viewingEvent,
    viewingFishCatches: state.fishingEvents.viewingFishCatches,
    viewLastUpdated: state.view.lastUpdated,
    species: state.species.all,
    db: state.database.db,
  };
}

export default connect(select)(FishingEventCatchesEditor);
