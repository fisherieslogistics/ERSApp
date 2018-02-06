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


const iconColors = {
  ok: colors.green,
  fishing: colors.blue,
  error: colors.orange,
  'upload-to-cloud': '#777777',
}

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
    const status = fe.status;
    const backgroundColor = iconColors[status];
    const sty = Object.assign({}, { backgroundColor }, iconStyles, { left: -40 });
    return {
      name: status,
      style: sty,
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
    const { targetSpecies_id, numberInTrip, datetimeAtStart } = fishingEvent.eventValues;
    return `#${numberInTrip}  ${targetSpecies_id || '---'}  ${moment(datetimeAtStart).format("HH:mm")}`;
  }

  isSelected(fishingEvent) {
    return this.props.viewingEvent.eventValues.numberInTrip === fishingEvent.eventValues.numberInTrip;
  }

  onPress(fishingEvent) {
    this.props.dispatch(setViewingEvent(fishingEvent));
  }

}

const select = (state) => {
  const  { viewingEvent, fishingEvents } =  state.fishingEvents;
  return {
    lastUpdated: state.trip.lastUpdated,
    dataSource: ds.cloneWithRows([...fishingEvents].reverse()),
    viewingEvent: viewingEvent || { eventValues: {}},
  }
}

export default connect(select)(FishingEventList);
