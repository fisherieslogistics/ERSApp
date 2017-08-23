'use strict';
import { ListView } from 'realm/react-native';
import React from 'react';
import {connect} from 'react-redux';
import RealmMasterListView from '../common/RealmMasterListView';
import Icon8 from '../common/Icon8';
import { setViewingEventId, setSelectedFishingDetail } from '../../actions/ViewActions';
import RealmHelper, {
  getLastRecord,
} from '../../database/RealmHelper';

const fishingEventDB = new RealmHelper('fishingEvent');

import { darkColors as colors, iconStyles } from '../../styles/styles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class FishingEventList extends RealmMasterListView {
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
    if(!fe.RAEnd_date){
      name = 'fishing';
      backgroundColor = colors.blue;
    }
    if(fe.RAEnd_date && !(fe.detailsValid && fe.estimatedCatchValid && fe.discardsValid && fe.protectedsValid)) {
      name = 'error';
      backgroundColor= colors.orange;
    }
    if(fe.completed) {
      name = 'upload-to-cloud';
      backgroundColor = colors.midGray;
    }
    const sty = Object.assign({}, { backgroundColor }, iconStyles);
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
  const trip = getLastRecord('trip');
  let viewingEvent = null;
  if(state.view.viewingEventId){
    viewingEvent = fishingEventDB.findOne(state.view.viewingEventId);
  }
  return {
    lastUpdated: state.trip.lastUpdated,
    dataSource: ds.cloneWithRows([...trip.fishingEvents].reverse()),
    selectedFishingEvent: viewingEvent,
  }
}

export default connect(select)(FishingEventList);
