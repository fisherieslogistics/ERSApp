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
    const { code, weightKgs, _id } = item;

    //no specices code delete it
    if(inputId === 'code') {
      if(_id && !value) {
        return this.deleteItem(_id, 'fishCatch');
      }
    }

    const changes = Object.assign({}, { code, weightKgs }, { [inputId]: value});
    if(item._isblank) {
      changes.fishingEvent_id = this.props.viewingEvent._id;
      changes.document_type = 'fishCatch';
      this.props.db.create(changes);
    } else {
      this.props.db.update(changes, _id);
    }
  }

  deleteItem = (item_id) => {
    if(item_id){
      this.props.db.delete(item_id, 'fishCatch');
    }
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
            items={ viewingFishCatches }
            viewLastUpdated={ viewLastUpdated }
          />
      );
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
