import settings from '../../constants/connectionSettings/navicom';
import Connection from './Connection';

export default class NavicomConnection extends Connection {

  constructor(props) {
    super(props);
    this.setup(settings);
  }

  startTracking() {
    this.tracking = false;
  }

  stopTracking() {
    this.tracking = false;
  }
}
