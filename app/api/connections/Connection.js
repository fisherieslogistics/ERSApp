import LocationHandler from '../location/LocationHandler';
import iossettings from '../../constants/connectionSettings/iosNative';


export default class Connection {

  constructor() {
    this.locationHandler = new LocationHandler();
    this.onDataRead = this.onDataRead.bind(this);
  }

  onLocationError(err) {
    //console.log(err);
    //this.locationHandler.setNullLocation();
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
    this.locationHandler.setDispatch(dispatch);
  }

  startTracking() {
    this.tracking = true;
  }

  stopTracking() {
    this.tracking = false;
  }

  setup() {
  }

  setConnectionStatusHandler(connectionStatusHandler) {
  }

  setMessageHandler(messageHandler) {
  }

  onError(error) {
    //console.log(error);
    this.stop();
    //this.start();
  }

  onDataRead(data) {
    if(!data) {
      return;
    }

    if(this.locationHandler) {
      this.locationHandler.handleSentence(data.data);
    }
  }

  onDisconnect() {
  }

  startReading() {
  }

  read() {
  }

  onConnect() {
  }

  start() {
  }

  write(toSend) {
  }

  connect() {
  }

  stop() {
  }

}
