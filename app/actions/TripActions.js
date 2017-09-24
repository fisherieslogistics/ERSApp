"use strict";
import uuid from 'uuid/v1';


export function startTrip(trip, id) {
  return {
    type: 'startTrip',
    realm: trip,
    payload: {
      RAId: trip.RAId,
      changes: {
        serverId: id,
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
        wingSpreadMetres: parseInt(trip.wingSpreadMetres),
        headlineHeightMetres: parseFloat(trip.headlineHeightMetres),
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
