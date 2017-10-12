'use strict';
import {
  View,
  AlertIOS,
} from 'react-native';
import React from 'react';
import FishingEventList from './FishingEventList';
import MasterDetail from '../layout/MasterDetail';
import { connect } from 'react-redux';
import {
  deleteFishingEvent,
  updateFishingEvent,
} from '../../actions/FishingEventActions';
import PositionDisplay from './PositionDisplay';
import EventEditor from './EventEditor';
import TopMasterButton from './common/TopMasterButton';
import BottomMasterButton from './common/BottomMasterButton';
import { setViewingEvent } from '../../actions/FishingEventActions';
import { TextButton } from '../common/Buttons';
import { MasterToolbar, DetailToolbar } from '../layout/Toolbar';
import { colors, toolbarStyles } from '../../styles/styles';

const toBind = [
  'removeFishingEvent',
];

class Fishing extends MasterDetail {
  constructor (props){
    super(props)
    toBind.forEach(funcName => {this[funcName] = this[funcName].bind(this)});
  }

  removeFishingEvent(){
    AlertIOS.prompt(
      'Delete Latest Shot',
      'Type "Delete" to confirm',
      [
        {text: 'Cancel', onPress: () => null, style: 'Cancel'},
        {text: 'Delete', onPress: (text) => {
          if(text && text.toLowerCase() === 'delete') {
            
            const { viewingEvent, fishingEvents } = this.props;
            this.props.db.update({ archived: true }, viewingEvent._id);
            const index = fishingEvents.findIndex(f => f._id === viewingEvent._id);
            const otherEvents = [...fishingEvents];
            otherEvents.splice(index, 1);
            
            const fixedEvents = otherEvents.map(fe => {
              if(fe.numberInTrip < viewingEvent.numberInTrip) {
                return fe;
              }
              return Object.assign({}, fe, { numberInTrip: fe.numberInTrip - 1});
            });
            
            this.props.dispatch({
              type: 'setFishingEvents',
              payload: { changes: fixedEvents },
            });
            this.props.dispatch({
              type: 'setViewingEvent',
              payload: { changes: null },
            });
          }
        }},
      ]
    );
  }

  renderDetailView(){
    return (
      <EventEditor />
    );
  }

  renderMasterListView() {
    return (
      <FishingEventList
        height={ this.props.height }
      />
    );
  }

  renderBottomMasterView() {
    return (
      <BottomMasterButton />
    );
  }

  renderDetailToolbar(){

    const posDisplay = (
      <PositionDisplay />
    );

    const circleWrapper = {
      top: 22,
      right: -60,
    }

    const deleteActive = !!this.props.viewingEvent// &&
      //this.props.viewingEvent.canDelete(this.props.fishingEvents.length);

    const rightProps = (
      <View>

      <TextButton
        text={ 'Delete' }
        style={ [toolbarStyles.textButton,] }
        color={ deleteActive ? colors.red : colors.midGray }
        textAlign={ "left"}
        onPress={ this.removeFishingEvent }
        disabled={ !deleteActive }
      />

      </View>

    );
    return (
      <DetailToolbar
        left={null}
        right={ rightProps }
        center={ posDisplay }
      />
    );
  }

  renderMasterToolbar(){
    const { viewingEvent, viewingEventHelper, fishingEventsUpdated } = this.props;
    const canEndEvent = viewingEvent && viewingEventHelper.canEnd;

    const button = (
      <TopMasterButton
        canEndEvent={ canEndEvent }
        lastUpdated={ fishingEventsUpdated }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

}

const select = (state) => {
  //  const trip = getLastRecord('trip');
  let viewingEvent = null;
  if(state.view.viewingEventId){
    //viewingEvent = fishingEventDB.findOne(state.view.viewingEventId);
  }
  const props = {
    fishingEventsUpdated: state.fishingEvents.lastUpdated,
    tripUpdated: state.trip.lastUpdated,
    orientation: state.view.orientation,
    height: state.view.height,
    trip: state.trip.currentTrip,
    location: state.location,
    averageSpeed: state.location.averagedSpeed.currentAvg,
    fishingEvents: state.fishingEvents.fishingEvents,
    signalStrength: state.connection.signalStrength,
    viewingEvent: state.fishingEvents.viewingEvent,
    viewingEventHelper: state.fishingEvents.viewingEventHelper,
    db: state.database.db,
  };
  return props;
}

export default connect(select)(Fishing);
