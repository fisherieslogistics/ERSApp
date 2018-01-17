"use strict";
import uuid from 'uuid/v1';
import {
  calculateStatArea,
} from '../reducers/GeneralMethods';
import { blankModel } from '../utils/ModelUtils';
import { locationToWKTPoint } from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TrawlEventModel from '../models/TrawlEventModel';
import TrawlEvent from '../models/addons/TrawlEvent';
import MPIFormType from '../constants/MPIFormType';


export function toggleOptionalFields() {
  return {
    type: 'toggleOptionalFields',
    payload: {}
  }
}

export function setViewingEvent(fishingEvent) {
  return {
    type: 'setViewingEvent',
    payload: {
      changes: fishingEvent,
    },
  }
}

export function setSelectedCatchesDetail(name) {
  return {
    type: 'setSelectedCatchesDetail',
    payload: { name },
  }
}

export function createFishingEvent(trip_id, previousEvent, location) {

  const newEvent = blankModel(FishingEventModel);
  const eventSpecificDetails = blankModel(TrawlEventModel);

  eventSpecificDetails.NetAtDepthLocation = location;
  newEvent.id = uuid();
  newEvent.trip_id = trip_id;
  newEvent.datetimeAtStart = new Date();
  newEvent.numberInTrip = previousEvent ? (previousEvent.numberInTrip) + 1 : 1;
  newEvent.locationAtStart = locationToWKTPoint(location);

  FishingEventModel.forEach(field => {
    if(previousEvent && field.repeating && previousEvent[field.id]) {
      newEvent[field.id] = previousEvent[field.id];
    }
    if(field.copyFrom) {
      const copiedValue = newEvent[field.copyFrom];
      const change = { [field.id]: copiedValue };
      Object.assign(newEvent, change);
    }
  });

  if(previousEvent) {
    const previousEventSpecificDetails = JSON.parse(previousEvent.eventSpecificDetails);
    TrawlEventModel.forEach(field => {
      if(previousEvent && field.repeating) {
        eventSpecificDetails[field.id] = previousEventSpecificDetails[field.id];
      }
      if(field.copyFrom) {
        const copiedValue = previousEventSpecificDetails[field.copyFrom];
        const change = { [field.id]: copiedValue };
        Object.assign(eventSpecificDetails, change);
      }
    });
  }

  newEvent.eventSpecificDetails = JSON.stringify(eventSpecificDetails);
  return newEvent;
}

export function deleteFishingEvent(fishingEvent) {
  return {
    type: 'deleteFishingEvent',

    payload: {
      RAId: fishingEvent.RAId,
    }
  };
}
