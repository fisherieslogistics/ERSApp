import moment from 'moment';
import VesselModel from '../models/VesselModel';
import { blankModel } from '../utils/ModelUtils';

const initialState = {
  vessel: blankModel(VesselModel),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateVessel':
      return Object.assign({}, state, { lastUpdated: moment().milliseconds() });
    default:
      return state;
  }
};
