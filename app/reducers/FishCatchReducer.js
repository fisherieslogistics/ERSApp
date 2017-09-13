import moment from 'moment';

const initialState = {
  fishCatches: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateFishCatch':
      return state;
    default:
      return state;
  }
};
