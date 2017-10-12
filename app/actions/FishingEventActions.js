"use strict";
import uuid from 'uuid/v1';
import {
  calculateStatArea,
} from '../reducers/GeneralMethods';
import { blankModel } from '../utils/ModelUtils';
import { locationToGeoJSONPoint } from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import HandGatheringEventModel from '../models/HandGatheringEventModel';
import HandGatheringEventHelper from '../models/addons/HandGatheringEvent';
import TrawlEventModel from '../models/TrawlEventModel';
import TrawlEventHelper from '../models/addons/HandGatheringEvent';


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

export function updateFishingEvent(fishingEvent) {
  /*if(changes.locationAtStart) {
    changes.statarea = calculateStatArea(changes.locationAtStart);
  }
  return (dispatch) => {
    dispatch({
      type: 'update-FishingEvent',

      payload: {
        RAId: fishingEvent.RAId,
        changes,
      }
    });
    const keys = Object.keys(changes);
    if( keys.includes('wingSpread') || keys.includes('headlineHeight') ) {
      //TODO update the trip
      //dispatch(update-trip(changes))
    }
  }*/
}

export function commitFishingEvent(fishingEvent) {
  /*return {
    type: 'updateFishingEvent',

    payload: {
      RAId: fishingEvent.RAId,
      changes: { committed: true, completed: true, signed: true },
    },
  }*/
}

export function createFishingEvent(trip_id, previousEvent, location) {
  const newEvent = blankModel(FishingEventModel);
  const newEventSpecifics = blankModel(HandGatheringEventModel);

  newEvent.eventSpecificDetails = JSON.stringify(newEventSpecifics);
  newEvent.id = uuid();
  newEvent.trip_id = trip_id;
  newEvent.datetimeAtStart = new Date();
  newEvent.numberInTrip = previousEvent ? (previousEvent.numberInTrip) + 1 : 1;
  newEvent.locationAtStart = locationToGeoJSONPoint(location);
  debugger;
  FishingEventModel.forEach(field => {
    if(previousEvent && field.repeating) {
      newEvent[field.id] = previousEvent[field.id];
    }
    if(field.copyFrom) {
      const copiedValue = newEvent[field.copyFrom];
      const change = { [field.id]: copiedValue };
      Object.assign(newEvent, change);
    }
  });

  return newEvent;
}

export function endFishingEvent(fishingEvent, changes, location) {
  /*eturn (dispatch) => {
    changes.locationAtEnd = locationToGeoJSONPoint(location);
    dispatch({
      type: 'endFishingEvent',

      payload: {
        changes,
        RAId: fishingEvent.RAId,
      }
    });

    if(fishingEvent.numberInTrip === 1) {
      dispatch(addItemToEvent(fishingEvent, 'estimatedCatch'));
      return;
    }

    /*const fishingEvents = getLastRecord('trip').fishingEvents;

    const previousEvent = fishingEvents.find(
      fe => fe.numberInTrip === (fishingEvent.numberInTrip - 1));
    dispatch(repeatEventCatches(fishingEvent, previousEvent.replicatedEstimatedCatch));*/

}

export function deleteFishingEvent(fishingEvent) {
  return {
    type: 'deleteFishingEvent',

    payload: {
      RAId: fishingEvent.RAId,
    }
  };
}

export function repeatEventCatches(fishingEvent, catches) {
  return {
    type: 'repeatEventCatches',

    payload: {
      RAId: fishingEvent.RAId,
      changes: {
        estimatedCatch: [...catches],
      },
    },
  };
}

export function changeItemInEvent(fishingEvent, item, changes, eventAttribute) {
  const actionNames = {
    estimatedCatch: 'updateProduct',
    discards: 'updateDiscard',
    protecteds: 'updateProtected',
  }
  if(changes.code) {
    changes.code = changes.code.toUpperCase();
  }
  if(isNaN(changes.weightKgs)) {
    changes.weightKgs = 0;
  }
  return {
    type: actionNames[eventAttribute],

    payload: {
      fishingEventId: fishingEvent.RAId,
      RAId: item.RAId,
      changes,
    }
  };
}
