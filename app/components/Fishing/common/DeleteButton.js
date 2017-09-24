'use strict';
import React, { Component } from 'react';
/*import {
  View,
  AlertIOS,
} from 'react-native';*/
//import Helper from '../../../utils/Helper';
import { connect } from 'react-redux';
import { BigButton } from '../../common/Buttons';
import { colors } from '../../../styles/styles';
//import { setViewingEventId } from '../../../actions/ViewActions';

import {
//  deleteFishingEvent,
} from '../../../actions/FishingEventActions';

import {
  getRecord,
  getLastRecord,
} from '../../../database/RealmHelper';

class HaulButton extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  /*endFishingEvent() {
    const changes = {
      RAEnd_date: new Date(),
      finishLocation: Helper.locationToGeoJSONPoint(this.props.location),
      NetLeaveDepthLocation: Helper.locationToGeoJSONPoint(this.props.location),
      averageSpeed: this.props.averageSpeed,
    };

    AlertIOS.alert(
      "Hauling",
      'Hauling Gear Now?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Finish', onPress: () => {
          this.props.dispatch(endFishingEvent(
              //TODO this needs to change for longline - cos you need the viewing event not the 'last event';
              this.props.viewingEvent, changes));

          this.props.dispatch(setViewingEventId(this.props.viewingEvent.RAId));


        }}

      ]
    );
  }*/

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
        text={ 'Finish' }
        backgroundColor={ backgroundColor }
        textColor={ textColor }
        onPress={ this.onPress }
      />
    );
  }

}

const select = (state) => {
  const trip = getLastRecord('trip');
  let viewingEvent = null;
  if(state.view.viewingEventId){
    viewingEvent = getRecord('fishingEvent', state.view.viewingEventId);
  }
  const props = {
    trip,
    fishingEvent: viewingEvent,
  };
  return props;
}

export default connect(select)(HaulButton);
