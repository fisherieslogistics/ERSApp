import moment from 'moment';

const initialState = {
  db: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'setDatabase':
      return action.payload
    default:
      return state;
  }
};
