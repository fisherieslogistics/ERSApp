import {
  updateWithTimeStamp,
  update,
} from '../utils/Helper';
import HandGatheringEventHelper from '../models/addons/HandGatheringEvent';
//import FishingEventModel from '../models/FishingEventModel';
import HandGatheringEventModel from '../models/HandGatheringEventModel';
import TrawlEventModel from '../models/TrawlEventModel';
import TrawlEventHelper from '../models/addons/TrawlEvent';
import MPIFormType from '../constants/MPIFormType';

let eventSpecificModel = TrawlEventModel;
let fishingEventHelper = TrawlEventHelper;

switch (MPIFormType) {
  case 'HandGatheringEvent':
    eventSpecificModel = HandGatheringEventModel;
    fishingEventHelper = HandGatheringEventHelper;
    break;
  default:
}


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
      return updateWithTimeStamp(state, {
          fishingEvents: replaceByArray(payload.changes, fishingEvents),
          viewingEventHelper: new fishingEventHelper(payload.changes),
          viewingEvent: payload.changes,
        });
    case 'create-fishingEvent':
      fishingEvents.push(payload.changes);
      return updateWithTimeStamp(state, {
        fishingEvents: [...fishingEvents],
        viewingEvent: payload.changes,
        viewingEventHelper: new fishingEventHelper(payload.changes),
        selectedDetail: 'detail',
        viewingFishCatches: [],
      });
    case 'setFishingEvents':
      payload.changes.sort((f1, f2) => (f1.numberInTrip > f2.numberInTrip) ? 1 : -1);
      return updateWithTimeStamp(state,
        { fishingEvents: payload.changes });
    case 'setFishCatches':
      payload.changes.sort((f1, f2) => (f1.weightKgs > f2.weightKgs) ? 1 : -1);
      return updateWithTimeStamp(state,
        { fishCatches: payload.changes });
    case 'setViewingEvent':
      const catches = fishCatches.filter(
        fc => fc.fishingEvent_id === payload.changes._id);
      catches.sort((f1, f2) => (f1.weightKgs > f2.weightKgs) ? 1 : -1);
      return updateWithTimeStamp(state, {
        viewingEvent: payload.changes,
        viewingEventHelper: new fishingEventHelper(payload.changes),
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
