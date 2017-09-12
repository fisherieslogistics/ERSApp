import moment from 'moment';

export default function AddUsefulToActions() {

  return (next) => (action) => next(Object.assign({}, action, {
    payload: {
      ...action.payload,
      timestamp: moment().toISOString(),
    }}));
}
