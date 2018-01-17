'use strict';
import React, { Component } from 'react';
import uuid from 'uuid/v1';
import { connect } from 'react-redux';
import { BigButton } from '../../common/Buttons';
import { colors } from '../../../styles/styles';
import { setViewingEvent } from '../../../actions/FishingEventActions';

import {
  createFishingEvent,
} from '../../../actions/FishingEventActions';


class ShootButton extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { trip, lastEvent, location } = this.props;
    if(this.props.enabled){
      const newEvent = createFishingEvent(trip._id, lastEvent && lastEvent.eventValues, location);
      this.props.db.create(newEvent);
    }
  }

  render() {

    const { green, white, backgrounds } = colors;
    const backgroundColor = this.props.enabled ? green : backgrounds.dark;
    const textColor = this.props.enabled ? white : backgrounds.light;

    return (
      <BigButton
        text={ 'Shoot' }
        backgroundColor={ backgroundColor }
        textColor={ textColor }
        onPress={ this.onPress }
        disabled={ !this.props.enabled }
      />
    );
  }

}

const select = (state) => {
  const fevents = state.fishingEvents.fishingEvents;
  const last = fevents[fevents.length - 1];
  const enabled = !(last && !last.eventValues.datetimeAtEnd);
  const props = {
    numberOf: fevents.length,
    trip: state.trip.currentTrip,
    fishingEvent: state.fishingEvents.viewingEvent,
    lastEvent: last,
    location: state.location,
    enabled,
    db: state.database.db,
  };
  return props;
}

export default connect(select)(ShootButton);
