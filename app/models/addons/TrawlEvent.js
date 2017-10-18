import moment from 'moment';
import TrawlEventModel from '../../models/TrawlEventModel';
import FishingEventModel from '../../models/FishingEventModel';

import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class TrawlEventHelper {
  
  constructor(trawlEvent) {
    this.fishingEvent = {};
    FishingEventModel.forEach(attr => {
      this.fishingEvent[attr.id] = trawlEvent[attr.id];
    });
  }

  datetimeAtStartMoment() {
    return moment(this.fishingEvent.datetimeAtStart);
  }

  get datetimeAtEndMoment() {
    return moment(this.fishingEvent.datetimeAtEnd);
  }

  get canEnd() {
    return !this.fishingEvent.datetimeAtEnd;
  }

  get shouldAddEmptyCatch() {
    return false;
  }

  get detailsValid() {
    const {
      locationAtEnd,
      locationAtStart,
      datetimeAtStart,
      datetimeAtEnd,
    } = this.fishingEvent;
    
    const {
      targetSpecies,
      wingSpread,
      headlineHeight,
      bottomDepth,
      groundropeDepth,
      averageSpeed,
    } = this.eventSpecificDetails;

    const stage1 = (targetSpecies && wingSpread && headlineHeight && locationAtStart && datetimeAtStart);
    if((!datetimeAtEnd && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(datetimeAtStart < datetimeAtEnd);
    const depths = !!(bottomDepth && groundropeDepth);
    return !!(stage1 && !!locationAtEnd && !!averageSpeed && depths && datesSweet);
  }

  get canSubmit() {
    const { datetimeAtEnd } = this.fishingEvent;
    return !!(this.detailsValid && datetimeAtEnd && this.estimatedCatchValid)
  }

  get estimatedCatchValid() {
    //const catchToCheck =  [ ...this.estimatedCatch];
    //last one is always a blank;
    return true;
    //catchToCheck.pop();
    //return this.estimatedCatch.length && catchToCheck.every(ec => (ec.code && ec.weightKgs));
  }

  get discardsValid() {
    return //!this.discards.length || [ ...this.discards ].every(ec => (ec.code && ec.weightKgs));
  }

  get protectedsValid() {
    return true;
  }

  get locationStartDecimal() {
    return JSONPointToLocation(this.fishingEvent.locationStart);
  }

  get locationAtEndDecimal() {
    return JSONPointToLocation(this.fishingEvent.locationAtEnd);
  }

  canDelete(latestInTrip) {
    return !this.fishingEvent.completed && (this.fishingEvent.numberInTrip === latestInTrip);
  }

  get fishServeObject() {
    return {};
  }
  
  fieldsToRender() {
    return FishingEventModel.concat(TrawlEventModel).filter(
      field => !!field.display);
  }
  
  changeEvent(name, value) {
    if(FishingEventModel.find(a => a.id === name)) {
      this.fishingEvent[name] = value;
    }
    else {
      this.eventSpecificDetails[name] = value;
    }
  }
  
  get fishingEventValues() {
    return Object.assign({}, this.fishingEvent,
      { eventSpecificDetails: JSON.stringify(this.eventSpecificDetails)});
  }

  get eventHeader() {
    //const vessel = getLastRecord('vessel');
    return {
      //eventID: this.RAId,
      //vesselNumber: vessel.registration,
      isVesselUsed: true,
      notes: 'Create By FLL Reporting',
    }
  }

}
