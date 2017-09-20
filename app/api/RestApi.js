import request from 'superagent';
import AsyncStorage from 'AsyncStorage';
import RealmHelper from '../database/RealmHelper';
import Helper from '../utils/Helper';
import uuid from 'uuid/v1';
import SERVER_URL from '../constants/ServerURL';
const SOFTWARE_VERSION = '1.10.01.0';
const SOFTWARE_VENDOR = 'Fishery Logistics';
import moment from 'moment';

const vesselDB = new RealmHelper('vessel');
const portDB = new RealmHelper('port');
const userDB = new RealmHelper('user');
const speciesDB = new RealmHelper('species');
const tripDB = new RealmHelper('trip');

const USER_NAME = 'testskipper';
const PASSWORD = 'pwnallthefesh';

const PERSON_IN_CHARGE = 'Skipper King';
const VESSEL_ID = SERVER_URL + 'rest-api/vessels/';
const FISHING_EVENT_URI = SERVER_URL + 'rest-api/fishingEvents/';
const TRIP_EVENT_URI = SERVER_URL + 'rest-api/trips/';
const PORT_DUNEDIN_ID = SERVER_URL + 'rest-api/ports/';
const VESSELS_URI = SERVER_URL + 'rest-api/vessels/';
const PORTS_URI = SERVER_URL + 'rest-api/ports/';
const SPECIES_URI = SERVER_URL + 'rest-api/species/';
const USERS_URI = SERVER_URL + 'rest-api/users/';
const TRIP_END_URI = SERVER_URL + 'rest-api/trip-end/';

const TRIP_START_PATH = 'v1/trip-start';
const TRIP_END_PATH = 'v1/trip-end';
const HAND_GATHERING_EVENT_PATH = 'v1/hand-gathering'

//const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3Rza2lwcGVyIiwiZXhwIjoxNTAzMzc3NzMwLCJlbWFpbCI6InNraXBzQHJlZ3VsYXJzaG93LmNvbSIsIm9yaWdfaWF0IjoxNTAzMzc0NzMwfQ.dIt0gBGXWSERN4mmLCE5P_pIwGK-tfh8kH3dJ1OtIJg'
//const REFRESH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3Rza2lwcGVyIiwiZXhwIjoxNTAzMzcyOTk4LCJlbWFpbCI6InNraXBzQHJlZ3VsYXJzaG93LmNvbSIsIm9yaWdfaWF0IjoxNTAzMzY5OTEzfQ.Pf2nupALO2jBlpN3w_EUhKEZwP1xhEECJ6SGb9GDnLo';


export function createFishingEvent(fishingEventObj) {

  const {
    RAId,
    numberOfInTrip,
    targetSpecies,
    RAStart_date,
    RAEnd_date,
    locationStart,
    locationEnd,
    tripRAId,
    numberOfPeople,
    estimatedCatchKg,
    estimatedCatch,
  } = fishingEventObj;

  const vessel = vesselDB.getFirst();
  const fishCatches = estimatedCatch.filter(
    f => (f.code && f.code.length === 3)).map(
      f => {
        const species = speciesDB.findOneWhere(` code = '${f.code}' `, 'createdTimestamp')
        return { weightKgs: f.amount, species: species.code };
    });

  const trip = tripDB.getLast();
  const port = portDB;
  const event_id = uuid();
  const header = {
    isVesselUsed: true,
    notes: "Some notes.",
    vesselNumber: vessel.registration,
    tripId: trip.RAId,
    softwareVendor: SOFTWARE_VENDOR,
    softwareVersion: SOFTWARE_VERSION,
    eventId: event_id,
    completedDateTime: moment().format(),
  }
  const json = fishingEventObj.toJSON(header, -45.3443, 171.3434);

  const objectToSend = {
    fishCatches,
    numberInTrip: numberOfInTrip,
    targetSpecies,
    datetimeAtStart: RAStart_date.toISOString(),
    datetimeAtEnd: RAEnd_date.toISOString(),
    committed: true,
    locationAtStart: Helper.geoJSONPointToWKTPoint(locationStart),
    locationAtEnd: Helper.geoJSONPointToWKTPoint(locationEnd),
    lineString: null,
    eventSpecificDetails: JSON.stringify({
      fishingMethod: 'H',
      numberOfPeople,
    }),
    mitigationDeviceCodes: JSON.stringify([]),
    vesselNumber: vessel.registration,
    isVesselUsed: true,
    completedDateTime: new Date().toISOString(),
    trip: trip.serverId,
    RAId,
    id: fishingEventObj.RAId,
    json,
    event_type: HAND_GATHERING_EVENT_PATH,
    headers: JSON.stringify({
      'Accept': 'application/json',
      'Signature': null,
      'Content-Type': 'application/json',
    }),
  };

  return postToAPI(FISHING_EVENT_URI, objectToSend);
}
//`${TRIP_EVENT_URI}${RAId}/`,

export function createTrip(tripObj, loc) {

  const {
    RAId,
    RAStart_date,
    RAEnd_date,
    leavingPort,
    endPort,
  } = tripObj

  const vessel = vesselDB.getFirst();
  const user = userDB.getFirst();
  const port = portDB.findOneWhere(` name = '${endPort}' `, 'createdTimestamp');
  const event_id = uuid();
  const header = {
    isVesselUsed: true,
    notes: "Some notes.",
    vesselNumber: vessel.registration,
    softwareVendor: SOFTWARE_VENDOR,
    softwareVersion: SOFTWARE_VERSION,
    eventId: event_id,
  }

  const json = tripObj.startToJSON(vessel.registration, user.username, header, -45.3443, 171.3434);
  const objectToSend = {
     id: RAId,
     personInCharge: user.username,
     ETA: RAEnd_date.toISOString(),
     startTime: RAStart_date.toISOString(),
     endTime: RAEnd_date.toISOString(),
     startLocation: port.location,
     endLocation: port.location,
     fishingEvents: [],
     unloadPort: port.id,
     vessel: vessel.id,
     event_type: TRIP_START_PATH,
     json,
     headers: JSON.stringify({
       'Accept': 'application/json',
       'Signature': null,
       'Content-Type': 'application/json',
     }),
  };

  return postToAPI(TRIP_EVENT_URI, objectToSend);
}

export function patchTrip(tripObj, loc) {
  const vessel = vesselDB.getFirst();
  const user = userDB.getFirst();
  const event_id = uuid();
  const header = {
    isVesselUsed: true,
    notes: "Some notes.",
    vesselNumber: vessel.registration,
    softwareVendor: SOFTWARE_VENDOR,
    softwareVersion: SOFTWARE_VERSION,
    eventId: event_id,
  }

  const json = tripObj.endToJSON(vessel.registration, user.username, header, -45.3443, 171.3434);
  const objectToSend = {
    id: tripObj.RAId,
    json,
    event_type: TRIP_END_PATH,
    headers: tripObj.fishServeHeadersJSON,
  }

  return postToAPI(TRIP_END_URI, objectToSend);
}

function getObjects(URI) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('refreshToken', (err, token) => {
      request
        .get(URI)
        .set('Authorization', `JWT ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(err) {
            console.log(err);
            return reject(err);
          }
          return resolve(res.body);
        });
    });
  });
}

export function getPorts() {
  return getObjects(PORTS_URI);
}

export function getSpecies() {
  return getObjects(SPECIES_URI);
}

export function getVessels() {
  return getObjects(VESSELS_URI);
}

function putToAPI(url, objectToSend) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('refreshToken', (err, token) => {
      return request
        .put(url)
        .send(objectToSend) // sends a JSON post body
        .set('Authorization', `JWT ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  });
}

function patchToAPI(url, objectToSend) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('refreshToken', (err, token) => {
      return request
        .patch(url)
        .send(objectToSend) // sends a JSON post body
        .set('Authorization', `JWT ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  });
}

function postToAPI(url, objectToSend) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('refreshToken', (err, token) => {
      return request
        .post(url)
        .send(objectToSend) // sends a JSON post body
        .set('Authorization', `JWT ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if(err) {
            //console.log(err);
            return reject(err);
          }
          return resolve(res);
        });
    });
  });
}
