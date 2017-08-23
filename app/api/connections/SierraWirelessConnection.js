import xml from 'xml-parser';
import settings from '../../constants/connectionSettings/sierraWireless';
import Connection from './Connection';
import LocationHandler from '../location/LocationHandler';
import UDPLocationListener from '../location/UDPLocationListener';
import { updateSignalStrength } from '../../actions/ConnectionActions';


class SierraConnectionStatusHandler {

  constructor() {
    this.handleData = this.handleData.bind(this);
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  handleData(data) {
    if(data.includes('<body>')) {
      return this.handleXML(data);
    }
  }

  handleXML (xml) {
    const signal = this.getSignalStrength(xml);
    if(signal) {
      this.dispatch(updateSignalStrength(signal));
    }
  }

  getSignalStrength(dataStr) {

    try {
      const stripped = dataStr.replace(/[^\x00-\x7F]/g, "");
      const xmlStr = stripped.substr(stripped.indexOf('v') + 1);
      const data = xml(xmlStr);
      const signalStrengthData = data.root.children.find(
        c => c.attributes.id === settings.signalStrengthId);
      return signalStrengthData.content;
    } catch (err) {
      return null;
    }
  }

}

export default class SierraWirelessConnection extends Connection {

  constructor() {
    super();
    this.setup(settings);
    this.relocationStartListener = this.relocationStartListener.bind(this);
    this.connectionStatusHandler = new SierraConnectionStatusHandler();
    this.locationHandler = new LocationHandler();
    this.setupLocationListener();
  }

  setupLocationListener() {
    this.locationListener = new UDPLocationListener();
    this.locationListener.setSettings({
      ...settings,
      messageCallback: this.onDataRead,
      closeCallback: this.relocationStartListener,
      errorCallback: this.relocationStartListener,
    });
  }

  relocationStartListener(err1, err2) {
    if(err1) {
      this.errorHandler(err1);
    }
    if(err2) {
      this.errorHandler(err2);
    }
    this.stopTracking();
    clearTimeout(this.setupTimeout);

    this.setupTimeout = setTimeout(() => {
      this.locationListener = null;
      this.setupLocationListener();
      this.startTracking();
    }, 5000);

  }

  startTracking() {
    this.locationListener.startServer();
  }

  stopTracking() {
    this.locationListener.closeServer();
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
    this.connectionStatusHandler.setDispatch(dispatch);
    this.locationHandler.setDispatch(dispatch);
  }

  onDataRead(err, dataString, rinfo) {
    if(err) {
      console.log(err, rinfo);
      return;
    }
    if(this.locationHandler) {
      this.locationHandler.handleSentence(dataString);
    }

    if(this.connectionStatusHandler) {
      this.connectionStatusHandler.handleData(dataString);
    }

    if(this.messageHandler) {
      this.messageHandler.handleData(dataString);
    }

  }

}
