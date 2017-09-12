'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventDiscardsEditor from './EventDiscardsEditor';
import EventProductsEditor from './EventProductsEditor';
import EventProtectedsEditor from './EventProtectedsEditor';
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';


class FishingEventCatchesEditor extends Component {

  render() {

    const {
      fishingEvent,
      deleteItem,
      addItem,
      changeItem,
    } = this.props;

    const props = {
      fishingEvent,
      deleteItem,
      addItem,
      changeItem,
    }

    switch (this.props.selectedDetail) {
      case "catches":
        return (
          <EventProductsEditor
            { ...props }
            model={ ProductModel }
            species={ this.props.species }
            dispatch={ this.props.dispatch }
            items={ this.props.fishingEvent.estimatedCatch }
            viewLastUpdated={ this.props.viewLastUpdated }
          />
        );
      case "discards":
        return (
          <EventDiscardsEditor
            { ...props }
            model={ DiscardModel }
            species={ this.props.species }
            items={ this.props.fishingEvent.discards }
            viewLastUpdated={ this.props.viewLastUpdated }
          />
        );
      case "protecteds":
        return (
          <EventProtectedsEditor
            { ...props }
            model={ ProtectedModel }
            items={ this.props.fishingEvent.protecteds }
            viewLastUpdated={ this.props.viewLastUpdated }
          />
        );
    }
  }
}

const select = (state) => {
  let fishingEvent = null;
  if(state.view.viewingEventId){
  //  fishingEvent = getRecord('fishingEvent', state.view.viewingEventId);
  }
  return {
    lastUpdated: state.fishingEvents.lastUpdated,
    fishingEvent: state.fishingEvents.viewingEvent,
    viewLastUpdated: state.view.lastUpdated,
    species: state.species.all,//getRecords('species'),
  };
}

export default connect(select)(FishingEventCatchesEditor);
