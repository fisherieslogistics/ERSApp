"use strict";
import uuid from 'uuid/v1';


export function startTrip(trip, serverID) {
  return {
    type: 'startTrip',
    realm: trip,
    payload: {
      RAId: trip.RAId,
      changes: {
        serverID,
        started: true,
        RAStart_date: new Date(),
      },
    },
  }
}

export function endTrip(trip){
  const changes = { completed: true, };
  return {
    type: 'endTrip',
    realm: trip,
    payload: {
      RAId: trip.RAId,
      changes,
      newTrip: {
        RAId: uuid(),
        wingSpread: parseInt(trip.wingSpread),
        headlineHeight: parseFloat(trip.headlineHeight),
        leavingPort: trip.leavingPort,
        endPort: trip.endPort,
      },
    },
  };
}

export function updateTrip(changes, trip) {
  return {
    type: 'updateTrip',
    realm: trip,
    payload: {
      RAId: trip.RAId,
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
