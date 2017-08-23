import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import moment from 'moment';
import nmea0183 from 'nmea-0183';
import { createSentence } from '../parsers/nmea';
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
    callback(null, { data: gpgga, timestamp: date });
    callback(null, { data: gpvtg, timestamp: date });
  } catch (err) {
    callback(err, null);
  }

}

export default class iOSLocation {

  constructor() {
    this.addCallbacks = this.addCallbacks.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this._eventEmitter = new NativeEventEmitter(comCLController);
    this.latestLocation = null;
  }

  startTracking() {
    comCLController.start();
  }

  stopTracking() {
    comCLController.stop();
  }

  addCallbacks(messageCallback, errorCallback) {
    this._eventEmitter.addListener('locationUpdated', (location) => {
      getNMEA(location, (err, nmeaString) => {
        if(!err) {
          this.latestLocation = nmeaString;
          messageCallback(nmeaString);
        }
      });
    });
    this._locationTimingInterval = setInterval(() => {
       if(!this.testLocation()){
         errorCallback('Old Location');
       }
    }, 10000);
    this._eventEmitter.addListener('error', errorCallback);
  }

  testLocation() {
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

  removeListeners() {
    this._eventEmitter.removeAllListeners();
  }

}
