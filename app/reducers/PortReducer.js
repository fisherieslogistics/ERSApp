import moment from 'moment';
import { updateWithTimeStamp } from '../utils/Helper';

const initialState = {
  all: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'setPorts':
      return updateWithTimeStamp(state, { all: payload.changes });
    default:
      return state;
  }
};
