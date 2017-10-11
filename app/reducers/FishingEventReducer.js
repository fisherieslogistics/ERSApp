import {
  updateWithTimeStamp,
  update,
} from '../utils/Helper';
import HandGatheringEventHelper from '../models/addons/HandGatheringEvent';

const initialState = {
  lastUpdated: new Date(),
  showOptionalFields: false,
  setSelectedCatchesDetail: 'catches',
  fishingEvents: [],
  viewingEvent: null,
  viewingEventHelper: null,
  selectedDetail: 'detail',
  canStartEvent: true,
  fishCatches: [],
  viewingFishCatches: [],
};

export default (state = initialState, action) => {

  const { type, payload } = action;
  let { fishingEvents, fishCatches } = state;
  
  switch(type) {
    case 'update-fishingEvent':
      if(payload.changes.archived === true) {
        return state;
      }
      let eventIndex = fishingEvents.findIndex(
        x => x.id == payload.changes.id);
      fishingEvents[eventIndex] = payload.changes;
      return updateWithTimeStamp(state, {
          fishingEvents: [...fishingEvents],
          viewingEventHelper: new HandGatheringEventHelper(payload.changes),
          viewingEvent: payload.changes,
        });
    case 'create-fishingEvent':
      fishingEvents.push(payload.changes);
      return updateWithTimeStamp(state, {
        fishingEvents: [...fishingEvents],
        viewingEvent: payload.changes,
        viewingEventHelper: new HandGatheringEventHelper(payload.changes),
        selectedDetail: 'detail',
        viewingFishCatches: [],
      });
    case 'setFishingEvents':
      payload.changes.sort((f1, f2) => (f1.numberInTrip > f2.numberInTrip) ? 1 : -1);
      return updateWithTimeStamp(state,
        { fishingEvents: payload.changes });
    case 'setFishCatches':
      payload.changes.sort((f1, f2) => (f1.amount > f2.amount) ? 1 : -1);
      return updateWithTimeStamp(state,
        { fishCatches: payload.changes });
    case 'setViewingEvent':
      const catches = fishCatches.filter(
        fc => fc.fishingEvent_id === payload.changes._id);
      catches.sort((f1, f2) => (f1.amount > f2.amount) ? 1 : -1);
      return updateWithTimeStamp(state, {
        viewingEvent: payload.changes,
        viewingEventHelper: new HandGatheringEventHelper(payload.changes),
        viewingFishCatches: catches,
      });
    case 'create-fishCatch':
      fishCatches.push(payload.changes);
      state.viewingFishCatches.push(payload.changes);
      return updateWithTimeStamp(state, {
        fishCatches: [...state.fishCatches],
        viewingFishCatches: [...state.viewingFishCatches],
      });
    case 'updateSpecies':
    case 'updateState':
    case 'updateWeight':
    case 'updateCustom':
    case 'updateDiscard':
    case 'updateProtected':
    case 'addDiscard':
    case 'addProtected':
    case 'deleteProduct':
    case 'deleteDiscard':
    case 'deleteProtected':
    case 'signForm':
      
      return update(state, {
        lastUpdated: new Date(),
      });
    case 'toggleOptionalFields':
      return update(state, {
        showOptionalFields: !state.showOptionalFields,
        lastUpdated: new Date(),
      });
    case 'setSelectedCatchesDetail':
      return update(state, {
        selectedCatchesDetail: payload.name,
        lastUpdated: new Date(),
      });
    default:
      return state;
  }

}
