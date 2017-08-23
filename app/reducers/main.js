"use strict";
import { combineReducers } from 'redux';
import FishingEventReducer from './FishingEventReducer';
import UserReducer from './UserReducer';
import VesselReducer from './VesselReducer';
import ViewReducer from './ViewReducer';
import TripReducer from './TripReducer';
import LocationReducer from './LocationReducer';
import ConnectionReducer from './ConnectionReducer';
import AuthReducer from './AuthReducer';

export const reducers = {
  fishingEvents: FishingEventReducer,
  user: UserReducer,
  vessel: VesselReducer,
  view: ViewReducer,
  trip: TripReducer,
  location: LocationReducer,
  connection: ConnectionReducer,
  auth: AuthReducer,
}

const MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const newState = MainReducer(state, action);
  const { type, payload } = action;

  if(type === 'loadSavedState'){
    const loadedState = MainReducer(undefined, {type: 'init'});
    const savedState = payload.savedState;
    if(!savedState){
      return newState;
    }
    Object.keys(savedState).forEach((k)=>{
      if(k in reducers){
        loadedState[k] = savedState[k];
      }
    });
    return MainReducer(loadedState, action);
  }

  //helper.saveToLocalStorage(newState, type);

  return newState;
}

export default (state, action) => mutateState(state, action);
