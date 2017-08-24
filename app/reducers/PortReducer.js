import moment from 'moment';

const initialState = {
  ports: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updatePorts':
      return action.ports;
    default:
      return state;
  }
};
