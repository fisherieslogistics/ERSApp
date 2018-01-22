"use strict";
import { combineReducers } from 'redux';
import FishingEventReducer from './FishingEventReducer';
import UserReducer from './UserReducer';
import VesselReducer from './VesselReducer';
import ViewReducer from './ViewReducer';
import TripReducer from './TripReducer';
import LocationReducer from './LocationReducer';
import PortReducer from './PortReducer';
import SpeciesReducer from './SpeciesReducer';
import DatabaseReducer from './DatabaseReducer';


export const reducers = {
  fishingEvents: FishingEventReducer,
  ports: PortReducer,
  species: SpeciesReducer,
  user: UserReducer,
  vessel: VesselReducer,
  view: ViewReducer,
  trip: TripReducer,
  location: LocationReducer,
  database: DatabaseReducer,
}

const MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const newState = MainReducer(state, action);
  return newState;
}

export default (state, action) => mutateState(state, action);
