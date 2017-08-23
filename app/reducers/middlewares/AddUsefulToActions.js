import moment from 'moment';
import VERSION from '../../constants/version';

export default function AddUsefulToActions() {


  return (next) => (action) => next(Object.assign({}, action, {
    payload: {
      ...action.payload,
      timestamp: moment().toISOString(),
      RAVersion: VERSION,
    }}))
}
