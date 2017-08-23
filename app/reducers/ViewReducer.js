import Orientation from 'react-native-orientation';
import {
  update,
} from './GeneralMethods';

let initialState = {
  viewingEvent: null,
  detailView: "forms",
  orientation: 'PORTRAIT',
  width: 768,
  height: 1024,
  suggestBarVisible: false,
  suggestBarChoices: [],
  suggestBarValue: null,
  suggestBarInputId: null,
  focusedInputId: null,
  suggestFavourites: {
    estimatedCatch: [],
  },
  lastUpdated: new Date(),
  selectedTab: 'trip',
}

initialState = getOrientationDetail(initialState, Orientation.getInitialOrientation());

export default (state = initialState, action) => {
  const { type, payload } = action;

  if(!state.orientation){
    state = getOrientationDetail(state, Orientation.getInitialOrientation());
  }
  switch (type) {

    case 'setViewingEventId':
      return update(state, { viewingEventId: payload.fishingEventId });
    case 'toggleSuggestBar':
      return update(state, { suggestBarChoices: [],
                             suggestBarSearchTerm: null,
                             suggestBarValue: null,
                             suggestBarVisible: payload.visible,
                             suggestBarInputId: payload.inputId,
                             lastUpdated: new Date(),
                           });
    case 'orientation':
      return getOrientationDetail(state, payload.orientation);
    case 'setSuggestChoices':
      return update(state, { suggestBarChoices: payload.choices, lastUpdated: new Date() });
    case 'setSuggestSearchTerm':
      return update(state, { suggestBarSearchTerm: payload.text, lastUpdated: new Date() });
    case 'setSuggestBarValue':
      return update(state, { suggestBarValue: payload.value, lastUpdated: new Date() });
    case 'loadSavedState':
      return update(state, { suggestBarChoices: [],
                             suggestBarSearchTerm: null,
                             suggestBarValue: null,
                             suggestBarVisible: false,
                             suggestBarInputId: null,
                             lastUpdated: new Date()
                           });
    case 'setFocusedInputId':
      return update(state, { focusedInputId: payload.inputId, lastUpdated: new Date() });
    case 'setSelectedFishingDetail':
      return update(state, { selectedFishingDetail: payload.name, lastUpdated: new Date()});
    case 'setSelectedTab':
      return update(state, { selectedTab: payload.tab, lastUpdated: new Date() });
  default:
      return state;
  }
};

function getOrientationDetail(state, orientation){
  switch (orientation) {
    case 'PORTRAIT':
    case 'PORTRAITUPSIDEDOWN':
      return update(state, { width: 768, height: 1024, orientation, lastUpdated: new Date() });
    case 'LANDSCAPE':
    case 'LANDSCAPEUPSIDEDOWN':
      return update(state, { width: 1024, height: 768, orientation, lastUpdated: new Date() });
    default:
      return state;
  }
}
