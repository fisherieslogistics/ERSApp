import moment from 'moment';
import UserModel from '../models/UserModel';
import { update } from './GeneralMethods';
import { blankModel } from '../utils/ModelUtils';

const initialState = {
  user:  blankModel(UserModel),
};

export default (state = initialState, action) => {

  switch (action.type) {
    case 'updateUser':
      return update(state, { lastUpdated: moment().milliseconds() });
    default:
      return state;
  }
};
