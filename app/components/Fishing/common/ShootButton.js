'use strict';
import React, { Component } from 'react';
import uuid from 'uuid/v1';
import { connect } from 'react-redux';
import { BigButton } from '../../common/Buttons';
import { colors } from '../../../styles/styles';
import { setViewingEventId, setSelectedFishingDetail } from '../../../actions/ViewActions';

import {
  startFishingEvent,
} from '../../../actions/FishingEventActions';


class ShootButton extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    if(this.props.trip.canStartEvent){
      const { trip } = this.props;
      const RAId = uuid();
      this.props.dispatch(startFishingEvent(trip.RAId, RAId, this.props.location));
      this.props.dispatch(setViewingEventId(RAId));
      this.props.dispatch(setSelectedFishingDetail('detail'));
    }
  }

  render() {
    const canStart = this.props.trip.canStartEvent;
    let backgroundColor = colors.green;
    let textColor = colors.white;
    if (!canStart) {
      backgroundColor = colors.backgrounds.dark;
      textColor = colors.backgrounds.light;
    }

    return (
      <BigButton
        text={ 'Start' }
        backgroundColor={ backgroundColor }
        textColor={ textColor }
        onPress={ this.onPress }
        disabled={ !this.props.trip.started }
      />
    );
  }

}

const select = (state) => {

  const props = {
    trip: state.trip.currentTrip,
    fishingEvent: state.fishingEvents.viewingEvent,
    location: state.location,
  };
  return props;
}

export default connect(select)(ShootButton);
