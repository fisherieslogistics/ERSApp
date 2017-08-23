"use strict";
import {
  calculateStatArea,
} from '../reducers/GeneralMethods';
import RealmHelper, {
  getLastRecord,
} from '../database/RealmHelper';
import { blankModel } from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';

const fishingEventDB = new RealmHelper('fishingEvent');

export function toggleOptionalFields() {
  return {
    type: 'toggleOptionalFields',
    payload: {}
  }
}

export function setSelectedCatchesDetail(name) {
  return {
    type: 'setSelectedCatchesDetail',
    payload: { name },
  }
}

export function updateFishingEvent(fishingEvent, changes) {
  if(changes.locationStart) {
    changes.statarea = calculateStatArea(changes.locationStart);
  }
  return (dispatch) => {
    dispatch({
      type: 'updateFishingEvent',
      realm: fishingEvent,
      payload: {
        RAId: fishingEvent.RAId,
        changes,
      }
    });
    const keys = Object.keys(changes);
    if( keys.includes('wingSpread') || keys.includes('headlineHeight') ) {
      //TODO update the trip
      //dispatch(updateTrip(changes))
    }
  }
}

export function commitFishingEvent(fishingEvent) {
  return {
    type: 'updateFishingEvent',
    realm: fishingEvent,
    payload: {
      RAId: fishingEvent.RAId,
      changes: { committed: true, completed: true, signed: true },
    },
  }
}

export function startFishingEvent(tripId, RAId, location) {
  const trip = getLastRecord('trip');
  let newEvent = blankModel(FishingEventModel);
  const previousEvent = fishingEventDB.findOneWhere(` tripRAId = '${trip.RAId}' `, 'numberOfInTrip');
  //const previousEvent = trip.fishingEvents.find(fe => fe.numberOfInTrip === trip.fishingEvents.length);
  newEvent.tripRAId = `${trip.RAId}`;
  newEvent.RAId = RAId;
  newEvent.RAStart_date = new Date();
  newEvent.numberOfInTrip = trip.fishingEvents.length + 1;
  //newEvent.wingSpread = trip.wingSpread;
  //newEvent.headlineHeight = trip.headlineHeight;
  newEvent.locationStart = Helper.locationToGeoJSONPoint(location);

  FishingEventModel.forEach(field => {
    if(previousEvent && field.repeating) {
      newEvent[field.id] = previousEvent[field.id];
    }
    if(field.copyFrom) {
      const copiedValue = newEvent[field.copyFrom];
      const change = { [field.id]: copiedValue };
      newEvent = Object.assign({}, newEvent, change);
    }
  });

  return {
      type: 'startFishingEvent',
      realm: { trip, newEvent },
      payload: {
        newEvent,
        tripId: trip.RAId,
      },
    };

}

export function endFishingEvent(fishingEvent, changes) {
  return (dispatch) => {

    dispatch({
      type: 'endFishingEvent',
      realm: fishingEvent,
      payload: {
        changes,
        RAId: fishingEvent.RAId,
      }
    });

    if(fishingEvent.numberOfInTrip === 1) {
      dispatch(addItemToEvent(fishingEvent, 'estimatedCatch'));
      return;
    }

    const fishingEvents = getLastRecord('trip').fishingEvents;

    const previousEvent = fishingEvents.find(
      fe => fe.numberOfInTrip === (fishingEvent.numberOfInTrip - 1));
    dispatch(repeatEventCatches(fishingEvent, previousEvent.replicatedEstimatedCatch));
  };
}

export function deleteFishingEvent(fishingEvent) {
  return {
    type: 'deleteFishingEvent',
    realm: fishingEvent,
    payload: {
      RAId: fishingEvent.RAId,
    }
  };
}

export function repeatEventCatches(fishingEvent, catches) {
  return {
    type: 'repeatEventCatches',
    realm: fishingEvent,
    payload: {
      RAId: fishingEvent.RAId,
      changes: {
        estimatedCatch: [...catches],
      },
    },
  };
}

export function addItemToEvent(fishingEvent, eventAttribute) {
  const actionNames = {
    estimatedCatch: 'addProduct',
    discards: 'addDiscard',
    protecteds: 'addProtected',
  }
  if(!(eventAttribute in actionNames)){
    throw new Error('NO')
  }
  return {
    type: actionNames[eventAttribute],
    realm: fishingEvent,
    payload: {
      RAId: fishingEvent.RAId,
    },
  };
}

export function deleteItemInEvent(fishingEvent, item, eventAttribute) {
  const actionNames = {
    estimatedCatch: 'deleteProduct',
    discards: 'deleteDiscard',
    protecteds: 'deleteProtected',
  }
  return {
    type: actionNames[eventAttribute],
    realm: item,
    payload: {
      fishingEventId: fishingEvent.RAId,
      RAId: item.RAId,
    }
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
  if(isNaN(changes.amount)) {
    changes.amount = 0;
  }
  return {
    type: actionNames[eventAttribute],
    realm: item,
    payload: {
      fishingEventId: fishingEvent.RAId,
      RAId: item.RAId,
      changes,
    }
  };
}
