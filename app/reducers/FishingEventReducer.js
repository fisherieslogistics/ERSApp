import {
  updateWithTimeStamp,
  update,
} from '../utils/Helper';
import MPIFormType from '../constants/MPIFormType';
import TrawlEvent from '../models/addons/TrawlEvent';


const initialState = {
  lastUpdated: new Date(),
  showOptionalFields: false,
  setSelectedCatchesDetail: 'catches',
  fishingEvents: [],
  viewingEvent: null,
  viewingEvent: null,
  selectedDetail: 'detail',
  canStartEvent: true,
  fishCatches: [],
  viewingFishCatches: [],
};

const removeById = (_id, list) => [...list.filter(x => x._id !== _id)];

const replaceByArray = (newDoc, list) => {
  let index = list.findIndex(
    x => x._id == newDoc._id);
  list[index] = newDoc;
  return [...list];
}

export default (state = initialState, action) => {

  const { type, payload } = action;
  let { fishingEvents, fishCatches, viewingFishCatches } = state;

  switch(type) {
    case 'update-fishingEvent':
      if(payload.changes.archived) {
        return state;
      }
      const updateEvent = new TrawlEvent(payload.changes);
      return updateWithTimeStamp(state, {
          fishingEvents: replaceByArray(updateEvent, fishingEvents),
          viewingEvent: updateEvent,
        });
    case 'create-fishingEvent':
      const newEvent = new TrawlEvent(payload.changes);
      fishingEvents.push(newEvent);
      return updateWithTimeStamp(state, {
        fishingEvents: [...fishingEvents],
        viewingEvent: newEvent,
        selectedDetail: 'detail',
        viewingFishCatches: [],
      });
    case 'setFishingEvents':
      payload.changes.sort((f1, f2) => (f1.eventValues.numberInTrip > f2.eventValues.numberInTrip) ? 1 : -1);
      return updateWithTimeStamp(state,
        { fishingEvents: payload.changes });
    case 'setFishCatches':
      payload.changes.sort((f1 , f2) => (f1.createdAt < f2.createdAt) ? 1 : -1);
      return updateWithTimeStamp(state, { fishCatches: payload.changes });
    case 'setViewingEvent':
      if(!payload.changes) {
        return updateWithTimeStamp(state, {viewingEvent: null, viewingEvent: null, viewingFishCatches: [] });
      }
      const catches = fishCatches.filter(
        fc => fc.fishingEvent_id === payload.changes._id);
      catches.sort((f1 , f2) => (f1.createdAt < f2.createdAt) ? 1 : -1);
      return updateWithTimeStamp(state, {
        viewingEvent: payload.changes,
        viewingFishCatches: catches,
      });
    case 'create-fishCatch':
      fishCatches.push(payload.changes)
      viewingFishCatches.push(payload.changes);
      return updateWithTimeStamp(state, {
        fishCatches: [...fishCatches],
        viewingFishCatches: [...viewingFishCatches],
      });
    case 'update-fishCatch':
      return updateWithTimeStamp(state, {
        fishCatches: replaceByArray(payload.changes, fishCatches),
        viewingFishCatches: fishCatches.filter(
          fc => fc.fishingEvent_id === state.viewingEvent._id),
        });
    case 'delete-fishCatch':
      return updateWithTimeStamp(state, {
        fishCatches: removeById(payload.changes, fishCatches),
        viewingFishCatches: removeById(payload.changes, viewingFishCatches),
      });
    case 'updateSpecies':
    case 'updateState':
    case 'updateWeight':
    case 'updateCustom':
    case 'updateDiscard':
    case 'updateProtected':
    case 'addDiscard':
    case 'addProtected':
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
