import request from 'superagent';
import AsyncStorage from 'AsyncStorage';
import RealmHelper from '../database/RealmHelper';
import Helper from '../utils/Helper';
import SERVER_URL from '../constants/ServerURL';

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
//const VESSELS_URI = SERVER_URL + 'rest-api/vessels/0a607198-e12d-4f6f-b054-b2524e32b29a/';
const VESSELS_URI = SERVER_URL + 'rest-api/vessels/';
const PORTS_URI = SERVER_URL + 'rest-api/ports/';
const SPECIES_URI = SERVER_URL + 'rest-api/species/';
const USERS_URI = SERVER_URL + 'rest-api/users/';

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
  };

  console.log(objectToSend);

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

  const objectToSend = {
     organisation: user.organisation,
     RAId,
     personInCharge: user.username,
     ETA: RAEnd_date.toISOString(),
     startTime: RAStart_date.toISOString(),
     endTime: RAEnd_date.toISOString(),
     startLocation: port.location,
     endLocation: port.location,
     fishingEvents: [],
     unloadPort: port.id,
     vessel: vessel.id,
  };

  return postToAPI(TRIP_EVENT_URI, objectToSend);
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
