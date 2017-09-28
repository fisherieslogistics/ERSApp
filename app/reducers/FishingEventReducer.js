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
};

export default (state = initialState, action) => {

  const { type, payload } = action;
  let { fishingEvents } = state;
  switch(type) {
    case 'update-fishingEvent':
      let eventIndex = fishingEvents.findIndex(
        x => x.id == payload._id);
      fishingEvents[eventIndex] = payload.changes;
      return updateWithTimeStamp(state, { fishingEvents });
    case 'create-fishingEvent':
      fishingEvents.push(payload.changes);
      return updateWithTimeStamp(state, {
        fishingEvents: [...fishingEvents],
        viewingEvent: payload.changes,
        viewingEventHelper: new HandGatheringEventHelper(payload.changes),
        selectedDetail: 'detail',
      });
    case 'setFishingEvents':
      return updateWithTimeStamp(state, { fishingEvents: payload.changes });
    case 'setViewingEvent':
      return updateWithTimeStamp(state, {
        viewingEvent: payload.changes,
        viewingEventHelper: new HandGatheringEventHelper(payload.changes),
      });
    case 'updateSpecies':
    case 'updateState':
    case 'updateWeight':
    case 'updateCustom':
    case 'updateDiscard':
    case 'updateProtected':
    case 'addProduct':
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
