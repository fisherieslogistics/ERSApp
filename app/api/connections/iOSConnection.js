import settings from '../../constants/connectionSettings/iosNative';
import iOSLocation from '../location/iOSLocation';
import Connection from './Connection';

export default class iOSConnection extends Connection {

  constructor(props) {
    super(props);
    this.setup(settings);
    this.locationListener = new iOSLocation();
    this.locationListener.addCallbacks(this.onDataRead, this.onLocationError);
  }

  startTracking() {
    this.locationListener.startTracking();
  }

  stopTracking() {
    this.locationListener.stopTracking();
  }

}
