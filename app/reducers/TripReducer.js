"use strict";
import { updateWithTimeStamp } from './GeneralMethods';
import Helper from '../utils/Helper';
import { Trip } from '../models/TripModel';


const initialState = {
  lastUpdated: new Date(),
  selectedHistoryTrips: [],
  trips: [],
  currentTrip: new Trip({}),
  totals: {
    products: [],
    discards: [],
  },
  selectedDetail: 'Trip',
}

const getTotalsList = (tripIds) => {

  const trips = [];//tripIds.map(id => tripDB.findOne(id));
  const catchObj = {};
  const discardObj = {};

  trips.forEach(t => t.fishingEvents.forEach(
    (fe) => {
      fe.estimatedCatch.forEach(ec => {
        if(ec.code && ec.amount) {
          if(catchObj[ec.code]) {
            catchObj[ec.code] += ec.amount;
          } else {
            catchObj[ec.code] = ec.amount;
          }
        }
      });
      fe.discards.forEach(d => {
        if(d.code && d.amount) {
          if(discardObj[d.code]) {
            discardObj[d.code] += d.amount;
          } else {
            discardObj[d.code] = d.amount;
          }
        }
      });
    })
  );

  return {
    products: Object.keys(catchObj).map(
      k => ({code: k, amount: catchObj[k]})),
    discards: Object.keys(discardObj).map(
      k => ({code: k, amount: discardObj[k]})),
  };
}



const TripReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'setInitialTrips':
      return updateWithTimeStamp(state, { trips: payload.changes });
    case 'setCurrentTrip':
      return updateWithTimeStamp(state, { currentTrip: new Trip(payload.changes) });
    case 'updateTrip':
      state.currentTrip.setValue(payload.changes);
      return updateWithTimeStamp({}, state);
    //case 'endTrip':
    //case 'updateTripState':
    //case 'startTrip':
    //  return update(state, { lastUpdated: new Date() });
    /*case 'addSelectedHistoryTrip':
      let tripIds = [payload.tripId];
      if(state.selectedHistoryTrips.includes(payload.tripId)) {
        tripIds = state.selectedHistoryTrips.filter(
          id => id !== payload.tripId);
      } else {
        tripIds = tripIds.concat(state.selectedHistoryTrips);
      }
      const totals = getTotalsList(tripIds);
      return update(state, {
        selectedHistoryTrips: tripIds,
        totals,
        lastUpdated: new Date(),
      });
    case 'emptySelectedHistoryTrips':
      return update(state,{
        selectedHistoryTrips: [],
        totals: initialState.totals,
        lastUpdated: new Date(),
      });
    case 'setSelectedTripDetail':
      return update(state, { selectedDetail: payload.name });*/
  }

  return state;
};

export default TripReducer;
