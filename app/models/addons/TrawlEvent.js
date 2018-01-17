import moment from 'moment';
import TrawlEventModel from '../../models/TrawlEventModel';
import FishingEventModel from '../../models/FishingEventModel';

import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class TrawlEvent {

  constructor(trawlEvent) {
    this.fishingEvent = {};
    this._id = trawlEvent._id;
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

  get eventSpecificDetails() {
    return JSON.parse(this.fishingEvent.eventSpecificDetails);
  }

  get detailsValid() {
    const {
      locationAtEnd,
      datetimeAtStart,
      datetimeAtEnd,
      locationAtStart,
      targetSpecies,
    } = this.fishingEvent;

    const {
      wingSpread,
      headlineHeight,
      bottomDepth,
      groundropeDepth,
      averageSpeed,
      NetAtDepthLocation,
      NetLeaveDepthLocation,
    } = this.eventSpecificDetails;

    const stage1 = (targetSpecies && wingSpread && headlineHeight && NetAtDepthLocation && datetimeAtStart);
    if((!datetimeAtEnd && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(datetimeAtStart < datetimeAtEnd);
    const depths = (bottomDepth && groundropeDepth) && (bottomDepth <= groundropeDepth);
    const is_valid = !!(stage1 && locationAtEnd && averageSpeed && depths && datesSweet && NetLeaveDepthLocation);
    return is_valid;
  }

  get status() {
    const { detailsValid, eventValues } = this;
    const { datetimeAtEnd, completed } = eventValues;
    if(completed) {
      return 'upload-to-cloud';
    }
    if(!datetimeAtEnd) {
      return 'fishing';
    }
    if(detailsValid) {
      return 'ok';
    }
    return 'error';
  }

  get canSubmit() {
    const { datetimeAtEnd } = this.fishingEvent;
    return !!(this.detailsValid && datetimeAtEnd && this.estimatedCatchValid)
  }

  canDelete(latestInTrip) {
    return !this.fishingEvent.completed && (this.fishingEvent.numberInTrip === latestInTrip);
  }

  get fishServeObject() {
    return {};
  }

  fieldsToRender(hideOptional) {
    return FishingEventModel.concat(TrawlEventModel).filter(
      field => (!!field.display &! (hideOptional && field.optionalRender)));
  }

  changeEvent(name, value) {
    if(FishingEventModel.find(a => a.id === name)) {
      this.fishingEvent[name] = value;
    }
    else {
      this.eventSpecificDetails[name] = value;
    }
  }

  get eventValues() {
    return Object.assign({}, this.fishingEvent, this.eventSpecificDetails);
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
