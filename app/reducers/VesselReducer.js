import moment from 'moment';
import VesselModel from '../models/VesselModel';
import { blankModel } from '../utils/ModelUtils';
import { updateWithTimeStamp } from './GeneralMethods';

const initialState = {
  all: [],
  selected: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'setVessels':
      console.log(payload);
      return updateWithTimeStamp(
        state, { all: payload.changes, selected: payload.changes[0] });
    default:
      return state;
  }
};
