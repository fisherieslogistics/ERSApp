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
      changes: {
        trip,
      },
    },
  }
}

export function startTrip(trip, id) {
  return {
    type: 'startTrip',

    payload: {
      RAId: trip.RAId,
      changes: {
        serverId: id,
        started: true,
        startTime: new Date(),
      },
    },
  }
}

export function endTrip(trip){
  const changes = { completed: true, };
  return {
    type: 'endTrip',

    payload: {
      RAId: trip.RAId,
      changes,
      newTrip: {
        RAId: uuid(),
        wingSpread: parseInt(trip.wingSpread),
        headlineHeight: parseFloat(trip.headlineHeight),
        leavingPort: trip.leavingPort,
        unloadPort: trip.unloadPort,
      },
    },
  };
}

export function updateTrip(changes, _id, _rev) {
  changes.type = 'trip';
  return {
    type: 'updateTrip',

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
