'use strict';
import React, { Component } from 'react';
import {
  AlertIOS,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { locationToGeoJSONPoint, locationToWKTPoint }from '../../../utils/Helper';
import { connect } from 'react-redux';
import { colors } from '../../../styles/styles';
import { setViewingEvent } from '../../../actions/FishingEventActions';
import { styles } from '../../common/Buttons/Button';


class HaulButton extends Component {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  endEvent = () => {
    const { viewingEvent, location, averageSpeed } = this.props;

    const eventSpecific = viewingEvent.eventSpecificDetails;
    eventSpecific.NetLeaveDepthLocation = location;
    eventSpecific.averageSpeed = averageSpeed;
    const change = {
      datetimeAtEnd: new Date(),
      locationAtEnd: locationToWKTPoint(location),
      eventSpecificDetails: JSON.stringify(eventSpecific),
    };
    AlertIOS.alert(
      "Hauling",
      'Hauling Gear Now?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Haul', onPress: () => {
          this.props.db.update(change, viewingEvent._id);
        }}
      ]
    );
  }

  onPress() {
    const { location } = this.props;

    if(location && location.lat && location.lon) {
      this.endEvent();
    } else {
      AlertIOS.alert('No Location Available', 'please go to settings > privacy > catchhub > location always.');
    }

  }

  render() {
    let backgroundColor = colors.red;
    let textColor = colors.white;
    let onPress = this.onPress;
    const { viewingEvent } = this.props;

    if (!(viewingEvent && viewingEvent.canEnd)) {
      backgroundColor = colors.backgrounds.dark;
      textColor = colors.backgrounds.light;
      onPress = null;
    }

    const textStyle = [
      { color: textColor },
      styles.bigButtonText,
    ];
    const buttonStyle = [ styles.bigButton];
    const innerStyle = { height: 95, backgroundColor }

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

  const props = {
    trip: state.trip.currentTrip,
    viewingEvent: state.fishingEvents.viewingEvent,
    location: state.location,
    averageSpeed: state.location.averagedSpeed.currentAvg,
    db: state.database.db,
    lastUpdated: state.fishingEvents.lastUpdated,
  };
  return props;
}

export default connect(select)(HaulButton);
