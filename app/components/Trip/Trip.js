'use strict';
import {
  View,
  Text,
  AlertIOS,
  ListView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { connect } from 'react-redux';
import MasterDetail from '../layout/MasterDetail';
import { setSelectedTab } from '../../actions/ViewActions';
import { setViewingEvent } from '../../actions/FishingEventActions';
import StartTripEditor from './StartTripEditor';
import { colors, textStyles } from '../../styles/styles';
import { MasterToolbar, DetailToolbar } from '../layout/Toolbar';
import { BigButton } from '../common/Buttons';
import Label from '../common/Label';
import { locationToWKTPoint } from '../../utils/Helper';
import PositionDisplay from '../Fishing/PositionDisplay';


const padStyle = { padding: 5, flex: 1 };


class Trip extends MasterDetail {

  startTrip(){

    const { user, trip, vessel, location, ports } = this.props;

    if(!location) {
      AlertIOS.alert('No Location Available', 'please go to settings > privacy > catchhub > location always.');
      return;
    }

    const title = `Please Confirm Correct`;
    const body = `
      Person in Charge:
      ${user.username}

      Vessel Name:
      ${vessel.name}

      Vessel Registration:
      ${vessel.registration}

      Leaving Port:
      ${trip.values(ports).leavingPort_id}
    `;
    AlertIOS.alert(
      title,
      body,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {
          const changes = { started: true, startLocation: locationToWKTPoint(location), vessel_id: vessel.id };
          this.props.db.update(changes, trip._id);
          this.props.dispatch(setSelectedTab('fishing'));
        }},
      ]
    );
  }

  endTrip = async () => {
    const { trip, location, ports, vessel } = this.props;

    if(!location) {
      return; AlertIOS.alert('No Location Available', 'please go to settings > privacy > catchhub > location always.');
    }

    AlertIOS.alert(
      `Heading to ${trip.values(ports).unloadPort_id}`,
      `Arriving in about ${trip.datetimeAtEndMoment.fromNow(true)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
          const changes = { active: false, endLocation: locationToWKTPoint(location), endTime: new Date() };
          await this.props.db.update(changes, trip._id);
          await this.props.db.createNewState();
          this.props.dispatch(setViewingEvent(null));
        }},
      ]
    );
  }

  onMasterButtonPress() {
    const { trip, fishingEvents } = this.props;
    if(trip.canStart) {
      return this.startTrip();
    } else if(trip.canEnd(fishingEvents.fishingEvents)) {
      return this.endTrip();
    }
  }

  renderMasterView() {
    return null;
  }

  renderDetailToolbar() {

    const posDisplay = (
      <PositionDisplay />
    );

    return (
      <DetailToolbar
        center={ posDisplay }
      />
    );
  }


  renderMasterToolbar = () => {
    const { trip, fishingEvents } = this.props;
    let backgroundColor = colors.backgrounds.dark;
    let text = "FLL";
    let textColor = 'rgba(255, 255, 255, 0.2)';

    if(trip.canStart) {
      backgroundColor = colors.green;
      textColor = colors.white;
      text = "Start Trip";
    }

    if(trip.values().started && trip.canEnd(fishingEvents.fishingEvents)) {
      backgroundColor = colors.red;
      textColor = colors.white;
      text = "End Trip";
    }

    const button = (
      <BigButton
        text={ text }
        backgroundColor={ backgroundColor }
        textColor={ textColor }
        onPress={ this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

  masterListOnPress(choice) {
    this.props.dispatch(setSelectedTripDetail(choice));
  }

  getDetail() {
    const { user, trip, ports } = this.props;
    if(!trip._id) {
      return null;
    };
    let vessel = this.props.vessel || { name: '', registration: '' };
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 140 }
        bouncesZoom={false}
        alwaysBounceVertical={false}
      >
        <StartTripEditor />
        <Label value={`${user.username} ${user.email}`} />
        <Label value={`${vessel.name} ${vessel.registration}`} />
      </KeyboardAwareScrollView>
    );
  }

  renderDetailView() {
    return (
      <View style={ padStyle }>
        { this.getDetail() }
      </View>
    );
  }

}

const select = (state) => {
  return {
    tripUpdated: state.trip.lastUpdated,
    trip: state.trip.currentTrip,
    vessel: state.vessel.selected,
    user: state.user.user,
    fishingEvents: state.fishingEvents,
    ports: state.ports.all,
    location: state.location.location,
    db: state.database.db,
  };
}

export default connect(select)(Trip);
