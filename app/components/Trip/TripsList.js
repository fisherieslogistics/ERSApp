'use strict';
'use strict';
import React from 'react';
import MasterListView from '../common/MasterListView';
import { textStyles, colors, listViewStyles, iconStyles } from '../../styles/styles';
import Icon8 from  '../common/Icon8';

export default class TripsList extends MasterListView {

  isSelected(trip) {
    return !!this.props.selectedTrips.find(t => t === trip.RAId);
  }

  getIcon(){
    return (
      <Icon8
        name={ 'truck-filled' }
        size={ 30 }
        color={ "white" }
        style={ [iconStyles, { backgroundColor: colors.blue, left: -50 } ] }
      />
    );
  }

  getTextStyle(isSelected){
    if(isSelected){
      return [ textStyles.font, listViewStyles.text, textStyles.white, { fontSize: 16 } ];
    }
    return [ textStyles.font, listViewStyles.text, { fontSize: 16 } ];
  }

  getDescription(trip) {
    const { active, datetimeAtStartMoment, datetimeAtEndMoment } = trip;
    if(!active) {
      return ` At Wharf `;
    }
    return `${datetimeAtStartMoment.format('Do MMM')} - ${datetimeAtEndMoment.format('Do MMM')}`;
  }

  onPress(trip){
    return this.props.onPress(trip);
  }

}
