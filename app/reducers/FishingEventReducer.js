import {
  update,
} from './GeneralMethods';

const initialState = {
  lastUpdated: new Date(),
  showOptionalFields: false,
  setSelectedCatchesDetail: 'catches',
  fishingEvents: [],
  viewingEvent: null,
};

export default (state = initialState, action) => {

  const { type, payload } = action;

  switch(type) {
    case 'startFishingEvent':
    case 'endFishingEvent':
    case 'deleteFishingEvent':
    case 'updateFishingEvent':
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
    case 'commitFishingEvent':
    case 'signForm':
      //console.log(type, 'is in the reducer');
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
