"use strict";
import { updateWithTimeStamp } from '../utils/Helper';
import TripEvent from '../models/addons/TripEvent';


const initialState = {
  lastUpdated: new Date(),
  trips: [],
  currentTrip: new TripEvent({}),
}

const TripReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'setInitialTrips':
      return updateWithTimeStamp(state, { trips: payload.changes });
    case 'setCurrentTrip':
      return updateWithTimeStamp(state, { currentTrip: new TripEvent(payload.changes) });
    case 'update-trip':
      const tripEvent = new TripEvent(payload.changes);
      return updateWithTimeStamp(state, { currentTrip: tripEvent });
  }
  return state;
};

export default TripReducer;
