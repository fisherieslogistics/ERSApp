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
      targetSpecies_id,
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

    const stage1 = (targetSpecies_id && wingSpread && headlineHeight && NetAtDepthLocation && datetimeAtStart);
    if((!datetimeAtEnd && stage1)) {
      return stage1;
    }
    const datesSweet =  moment(datetimeAtStart).isBefore(datetimeAtEnd);
    const depths = (bottomDepth && groundropeDepth) && (bottomDepth >= groundropeDepth);
    const is_valid = !!(stage1 && locationAtEnd && (!isNaN(averageSpeed)) && depths && datesSweet && NetLeaveDepthLocation);
    return is_valid;
  }

  get status() {
    const { detailsValid, eventValues } = this;
    const { datetimeAtEnd, committed } = eventValues;
    if(committed) {
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
    let toShow = FishingEventModel.concat(TrawlEventModel).filter(
      field => (!!field.display &! (hideOptional && field.optionalRender)));
    if(!this.eventValues.datetimeAtEnd) {
      return toShow.filter(attr => !(attr.displayStage && attr.displayStage === 'Haul'));
    }
    return toShow;
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

}
