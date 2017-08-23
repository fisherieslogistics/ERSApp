import moment from 'moment';
/*import SierraWirelessConnection from '../api/connections/SierraWirelessConnection';
import NavicomConnection from '../api/connections/NavicomConnection';*/
import iOSConnection from '../api/connections/iOSConnection';

const sierraWirelessConnection = null;//new SierraWirelessConnection();
const navicomConnection = null;//new NavicomConnection();
const iosConnection = new iOSConnection();

const connections = {
  sierra: sierraWirelessConnection,
  navicom: navicomConnection,
  ios: iosConnection,
};

import { update } from './GeneralMethods';

const initialState = {
  status: '',
  dataToSend: 0,
  lastUpdated: moment().milliseconds(),
  activeConnection: iosConnection,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'dataToSend':
      return update(state, { dataToSend: payload, lastUpdated: new Date() })
    case 'signalStrength':
      return update(state, { signalStrength: payload, lastUpdated: new Date() });
    case 'setActiveConnection':
      Object.keys(connections).forEach(k => connections[k].stop());
      const activeConnection = connections[payload.name];
      return update(state, { activeConnection });
    case 'startConnection':
      state.activeConnection.setup();
      state.activeConnection.start();
      return update(state, { lastUpdated: new Date() });
    case 'stopConnection':
      state.activeConnection.stop();
      return update(state, { lastUpdated: new Date() });
    case 'startTracking':
      state.activeConnection.startTracking();
      return update(state, { lastUpdated: new Date() });
    case 'stopTracking':
      state.activeConnection.stopTracking();
      return update(state, { lastUpdated: new Date() });
    default:
      return state;
  }
};
