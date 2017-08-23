import moment from 'moment';

const initialState = {
  auth: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateAuth':
      return Object.assign(
        {},
        state,
        {
          auth: action.payload.auth,
          lastUpdated: moment().milliseconds(),
        }
      );
    default:
      return state;
  }
};
