"use strict";
import moment from 'moment';
import version from '../constants/version';

export function updateSignalStrength(result) {
  return {
    type: 'signalStrength',
    payload: result,
  }
}

export function dataToSend(dataToSend){
  return {
    type: 'dataToSend',
    payload: dataToSend,
  };
}

export function updateConnectionStatus(status) {
  return {
    type: 'connectionStatus',
    payload: status,
  };
}

export function updateConnectionSettings(settings) {
  return {
    type: 'connectionSettings',
    realm: settings,
    payload: Object.assign({}, settings, { active: true }),
  };
}

export function setVersion() {
  return {
    type: 'RAVersion',
    payload: { version },
  }
}

export function setConnectionSettings(name) {
  return {
    type: 'setActiveConnection',
    payload: { name },
  }
}


export function startConnection() {
  return {
    type: 'startConnection',
    payload: { start: true },
  }
}

export function stopConnection() {
  return {
    type: 'stopConnection',
    payload: { start: true },
  }
}

export function startTracking() {
  return {
    type: 'startTracking',
    payload: { start: true },
  }
}

export function stopTracking() {
  return {
    type: 'stopTracking',
    payload: { start: true },
  }
}
