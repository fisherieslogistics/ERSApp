"use strict";
import uuid from 'uuid/v1';

export function setInitialTrips(trips) {
  return {
    type: 'setInitialTrips',
    payload: {
      changes: {
        trips,
      },
    },
  }
}

export function setCurrentTrip(trip) {
  return {
    type: 'setCurrentTrip',
    payload: {
      changes: trip,
    },
  }
}

export function startTrip() {
  return {
    type: 'updateTrip',
    payload: {
      changes: {
        started: true,
      },
    },
  }
}

export function endTrip(trip){
  const changes = { completed: true, };
  return {
    type: 'endTrip',
    payload: {
      changes,
      trip_id: trip._id,
      newTrip: {
        _id: uuid(),
        leavingPort: trip.leavingPort,
        unloadPort: trip.unloadPort,
      },
    },
  };
}

export function updateTrip(changes, _id, _rev) {
  changes.type = 'trip';
  return {
    type: 'update-trip',
    payload: {
      _id,
      _rev,
      changes,
    },
  }
}

export function addSelectedHistoryTrip(trip) {
  return {
    type: 'addSelectedHistoryTrip',
    payload: {
      tripId: trip.RAId,
    }
  }
}

export function emptySelectedHistoryTrips() {
  return {
    type: 'emptySelectedHistoryTrips',
    payload: {
    }
  }
}


export function setSelectedTripDetail(name) {
  return {
    type: 'setSelectedTripDetail',
    payload: {
      name
    },
  }
}
