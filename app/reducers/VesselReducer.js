import { updateWithTimeStamp } from '../utils/Helper';

const initialState = {
  all: [],
  selected: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'setVessels':
      return updateWithTimeStamp(
        state, { all: payload.changes, selected: payload.changes[0] });
    default:
      return state;
  }
};
