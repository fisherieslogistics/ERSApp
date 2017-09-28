'use strict';
import { ListView } from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterListView from '../common/MasterListView';
import Icon8 from '../common/Icon8';
import { setSelectedFishingDetail } from '../../actions/ViewActions';
import { setViewingEvent } from '../../actions/FishingEventActions';

import { darkColors as colors, iconStyles } from '../../styles/styles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

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
    if(!fe.datetimeAtEnd){
      name = 'fishing';
      backgroundColor = colors.blue;
    }
    if(fe.datetimeAtEnd /*&& !(fe.detailsValid && fe.estimatedCatchValid && fe.discardsValid && fe.protectedsValid)*/) {
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
    const { targetSpecies, numberInTrip } = fishingEvent;
    return `${numberInTrip}  ${moment(fishingEvent.datetimeAtStart).format("HH:mm")} ${targetSpecies}`;
  }

  isSelected(fishingEvent) {
    return this.props.viewingEvent._id === fishingEvent._id; 
  }

  onPress(fishingEvent) {
    this.props.dispatch(setViewingEvent(fishingEvent));
    this.props.dispatch(setSelectedFishingDetail('detail'));
  }

}

const select = (state) => {
  return {
    lastUpdated: state.trip.lastUpdated,
    dataSource: ds.cloneWithRows([...state.fishingEvents.fishingEvents].reverse()),
    viewingEvent: state.fishingEvents.viewingEvent || {},
  }
}

export default connect(select)(FishingEventList);
