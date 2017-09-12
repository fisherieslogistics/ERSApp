'use strict';
import { ListView } from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import MasterListView from '../common/MasterListView';
import Icon8 from '../common/Icon8';
import { setViewingEventId, setSelectedFishingDetail } from '../../actions/ViewActions';


import { darkColors as colors, iconStyles } from '../../styles/styles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class FishingEventList extends MasterListView {
  constructor(props){
    super(props);
    this.getDescription = this.getDescription.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.ds = ds;
  }

  eventStatus(fe){
    let backgroundColor = colors.green;
    let name = 'ok';
    if(!fe.endTime){
      name = 'fishing';
      backgroundColor = colors.blue;
    }
    if(fe.endTime && !(fe.detailsValid && fe.estimatedCatchValid && fe.discardsValid && fe.protectedsValid)) {
      name = 'error';
      backgroundColor= colors.orange;
    }
    if(fe.completed) {
      name = 'upload-to-cloud';
      backgroundColor = colors.midGray;
    }
    const sty = Object.assign({}, { backgroundColor }, iconStyles, { left: -50 });
    return {
      name,
      style: sty
    };
  }

  getIcon(fishingEvent){
    const iconProps = this.eventStatus(fishingEvent);
    return (
      <Icon8
        name={iconProps.name}
        style={iconProps.style}
        size={30}
        color={'white'}
      />
    );
  }

  getDescription(fishingEvent) {
    const { targetSpecies, numberOfInTrip } = fishingEvent;
    return `${numberOfInTrip}  ${fishingEvent.startDateMoment.format("HH:mm")} ${targetSpecies}`;
  }

  isSelected(fishingEvent) {
    return this.props.selectedFishingEvent && fishingEvent.RAId === this.props.selectedFishingEvent.RAId;
  }

  onPress(fishingEvent) {
    this.props.dispatch(setViewingEventId(fishingEvent.RAId));
    this.props.dispatch(setSelectedFishingDetail('detail'));
  }

}

const select = (state) => {
  let viewingEvent = null;
  if(state.view.viewingEventId){
    viewingEvent = state.fishingEvents.viewingEvent;
  }
  return {
    lastUpdated: state.trip.lastUpdated,
    dataSource: ds.cloneWithRows([...state.fishingEvents].reverse()),
    selectedFishingEvent: viewingEvent,
  }
}

export default connect(select)(FishingEventList);
