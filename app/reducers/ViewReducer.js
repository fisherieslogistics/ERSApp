import Orientation from 'react-native-orientation';
import { Dimensions } from 'react-native';
import {
  update,
} from './GeneralMethods';

let window = Dimensions.get('window');

let initialState = {
  viewingEvent: null,
  detailView: "forms",
  orientation: 'PORTRAIT',
  width: window.width,
  height: window.height,
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

    case 'toggleSuggestBar':
      console.log(payload)
      return update(state, {
                             suggestBarSearchTerm: null,
                             suggestBarValue: null,
                             suggestBarVisible: payload.changes.visible,
                             suggestBarInputId: payload.changes.inputId,
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
  const { width, height } = Dimensions.get('window');
  switch (orientation) {
    case 'PORTRAIT':
    case 'PORTRAITUPSIDEDOWN':
      return update(state, { width, height, orientation, lastUpdated: new Date() });
    case 'LANDSCAPE':
    case 'LANDSCAPEUPSIDEDOWN':
      return update(state, { width, height, orientation, lastUpdated: new Date() });
    default:
      return state;
  }
}
