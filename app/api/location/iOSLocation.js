import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import moment from 'moment';
import nmea0183 from 'nmea-0183';
import { createSentence } from '../parsers/nmea';
import { GPGGAUpdate, GPVTGUpdate } from '../../actions/LocationActions';

const { comCLController } = NativeModules;


export function getNMEA(location, callback) {
  const {
    longitude,
    latitude,
    timestamp,
    speedKts,
    altitude,
    course,
  } = location;

  //like this one => $GPGGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh
  if(!(longitude && latitude && timestamp && !isNaN(speedKts) && !isNaN(altitude))){
    callback("bad location", null);
  }

  try {
    const date = moment(timestamp * 1000).toDate();
    const gpgga = nmea0183.encode('GPGGA',{
      date,
      status:'A',
      lat: latitude,
      lon: longitude,
      speed: speedKts,
      altitude,
      fix:1,
      satellites: 4,//just some number - if its less than 4 we wouldn't have the accuracy
      hdop:0,
      aboveGeoid: 0,
      course,
    });
    const gpvtg = createSentence(`$GPVTG,${course},T,,M,0${speedKts.toFixed(1)},N,000.0,K,A`);
    callback(null, { gpgga, timestamp: date, gpvtg });
  } catch (err) {
    callback(err, null);
  }

}

export default class iOSLocation {

  constructor(dispatch) {
    this._dispatch = dispatch;
    this._eventEmitter = new NativeEventEmitter(comCLController);
    this.latestLocation = null;
    this.addCallbacks();
    this.startTracking();
  }

  startTracking = () => {
    comCLController.start();
  }

  stopTracking = () => {
    comCLController.stop();
  }

  addCallbacks = () => {
    this._eventEmitter.addListener('locationUpdated', (location) => {
      getNMEA(location, (err, nmeas) => {
        if(!err) {
          this.latestLocation = nmeas;
          this._dispatch(GPGGAUpdate(nmeas.gpgga));
          this._dispatch(GPVTGUpdate(nmeas.gpvtg));
        }
      });
    });
    this._locationTimingInterval = setInterval(() => {
       if(!this.testLocation()) {
         this._dispatch(GPGGAUpdate(null));
       }
    }, 10000);
    this._eventEmitter.addListener('error', () =>  this._dispatch(GPGGAUpdate(null)));
  }

  testLocation = () => {
    if(!(this.latestLocation && this.latestLocation.date)) {
      return false;
    }
    const tooOld = moment();
    tooOld.subtract(60, 'seconds');
    if(this.latestLocation.date.isBefore(tooOld)) {
      return false;
    }
    return true;
  }

  removeListeners = () => {
    this._eventEmitter.removeAllListeners();
  }

}
