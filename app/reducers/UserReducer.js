import moment from 'moment';
import UserModel from '../models/UserModel';
import { update } from './GeneralMethods';
import { blankModel } from '../utils/ModelUtils';

const initialState = {
  user:  blankModel(UserModel),
};

export default (state = initialState, { type, payload }) => {

  switch (type) {
    case 'setUser':
      return update(state, { user: payload.changes });
    default:
      return state;
  }
};
