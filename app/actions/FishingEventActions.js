"use strict";
import {
  calculateStatArea,
} from '../reducers/GeneralMethods';
import { blankModel } from '../utils/ModelUtils';
import { locationToGeoJSONPoint } from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';


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
    changes.statarea = calculateStatArea(changes.locationStart);
  }
  return (dispatch) => {
    dispatch({
      type: 'updateFishingEvent',

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
  }
}

export function commitFishingEvent(fishingEvent) {
  return {
    type: 'updateFishingEvent',

    payload: {
      RAId: fishingEvent.RAId,
      changes: { committed: true, completed: true, signed: true },
    },
  }
}

export function startFishingEvent(tripId, RAId, location, trip, previousEvent) {
  let newEvent = blankModel(FishingEventModel);
  newEvent.tripRAId = `${trip.RAId}`;
  newEvent.RAId = RAId;
  newEvent.startTime = new Date();
  newEvent.numberOfInTrip = trip.fishingEvents.length + 1;
  newEvent.locationAtStart = locationToGeoJSONPoint(location);

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

      payload: {
        newEvent,
        tripId: trip.RAId,
      },
    };

}

export function endFishingEvent(fishingEvent, changes, location) {
  return (dispatch) => {
    changes.locationEnd = Helper.locationToGeoJSONPoint(location);

    dispatch({
      type: 'endFishingEvent',

      payload: {
        changes,
        RAId: fishingEvent.RAId,
      }
    });

    if(fishingEvent.numberOfInTrip === 1) {
      dispatch(addItemToEvent(fishingEvent, 'estimatedCatch'));
      return;
    }

    /*const fishingEvents = getLastRecord('trip').fishingEvents;

    const previousEvent = fishingEvents.find(
      fe => fe.numberOfInTrip === (fishingEvent.numberOfInTrip - 1));
    dispatch(repeatEventCatches(fishingEvent, previousEvent.replicatedEstimatedCatch));*/
  };
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

    payload: {
      fishingEventId: fishingEvent.RAId,
      RAId: item.RAId,
      changes,
    }
  };
}
