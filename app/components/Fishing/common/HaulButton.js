'use strict';
import React, { Component } from 'react';
import {
  AlertIOS,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { locationToGeoJSONPoint }from '../../../utils/Helper';
import { connect } from 'react-redux';
import { colors } from '../../../styles/styles';
import { setSelectedFishingDetail } from '../../../actions/ViewActions';
import { setViewingEvent } from '../../../actions/FishingEventActions';
import { styles } from '../../common/Buttons/Button';

import {
  endFishingEvent
} from '../../../actions/FishingEventActions';


class HaulButton extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const loc = locationToGeoJSONPoint(this.props.location)
    const changes = {
      endTime: new Date(),
      datetimeAtEnd: loc,
      NetLeaveDepthLocation: loc,
      averageSpeed: this.props.averageSpeed,
    };

    AlertIOS.alert(
      "Hauling",
      'Hauling Gear Now?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Haul', onPress: () => {
          this.props.dispatch(endFishingEvent(
              //TODO this needs to change for longline - cos you need the viewing event not the 'last event';
              this.props.fishingEvent, changes, this.props.location));

          this.props.dispatch(setViewingEvent(this.props.fishingEvent));
          this.props.dispatch(setSelectedFishingDetail('detail'));

        }}

      ]
    );
  }

  render() {
    let backgroundColor = colors.red;
    let textColor = colors.white;
    let onPress = this.onPress;
    const { fishingEventHelper } = this.props;
    if ((fishingEventHelper && fishingEventHelper.canEnd)) {
      backgroundColor = colors.backgrounds.dark;
      textColor = colors.backgrounds.light;
      onPress = null;
    }

    const textStyle = [
      { color: textColor },
      styles.bigButtonText,
    ];
    const buttonStyle = [ styles.bigButton];
    const innerStyle = { height: 70,backgroundColor }

    return (
      <TouchableOpacity onPress={ onPress } style={buttonStyle}>
         <View style={[ styles.bigButtonInner, innerStyle] }>
          <Text style={ textStyle }>
            { 'Haul' }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const select = (state) => {

  let fishingEvent = null;
  if(state.view.viewingEventId){
  //  fishingEvent = getRecord('fishingEvent', state.view.viewingEventId);
  }

  const props = {
    trip: state.trip.currentTrip,
    fishingEvent: state.fishingEvent.viewingEvent,
    location: state.location,
    averageSpeed: state.location.averagedSpeed.currentAvg,
    fishingEventHelper: state.fishingEvents.fishingEventHelper,
  };
  return props;
}

export default connect(select)(HaulButton);
