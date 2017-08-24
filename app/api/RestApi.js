import request from 'superagent';
import AsyncStorage from 'AsyncStorage';
const USER_NAME = 'testskipper';
const PASSWORD = 'pwnallthefesh';

const PERSON_IN_CHARGE = 'Skipper King';
const VESSEL_ID = 'http://localhost:8000/vessels/161e0b38-7731-411d-ae3e-5b9e03adbcef/';
const FISHING_EVENT_URI = 'http://localhost:8000/fishingEventWithCatches/';
const TRIP_EVENT_URI = 'http://localhost:8000/trips/';
const PORT_DUNEDIN_ID = 'http://localhost:8000/ports/394b6ff4-9ef3-487f-9e28-dd003761c8ba/';
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
  } = fishingEventObj;

  const objectToSend = {
    fishCatches: estimatedCatchKg,
    numberInTrip: numberOfInTrip,
    targetSpecies,
    datetimeAtStart: RAStart_date.toISOString(),
    datetimeAtEnd: RAEnd_date.toISOString(),
    committed: true,
    locationAtStart: locationStart,
    locationAtEnd: locationEnd,
    lineString: {},
    eventSpecificDetails: {
      fishingMethod: 'H',
      numberOfPeople,
    },
    mitigationDeviceCodes: {},
    vesselNumber: 1,
    isVesselUsed: true,
    completedDateTime: new Date().toISOString(),
    trip: tripRAId,
    RAId,
    id: RAId,
  }

  return postToAPI(FISHING_EVENT_URI, objectToSend);
}
//`${TRIP_EVENT_URI}${RAId}/`,

export function createTrip(tripObj) {

  const {
    RAId,
    RAStart_date,
    RAEnd_date,
  } = tripObj

  const objectToSend = {
     id: RAId,
     RAId,
     personInCharge: PERSON_IN_CHARGE,
     ETA: RAEnd_date.toISOString(),
     startTime: RAStart_date.toISOString(),
     endTime: RAEnd_date.toISOString(),
     startLocation: '{}',
     endLocation: '{}',
     unloadPort: PORT_DUNEDIN_ID,
     vessel: VESSEL_ID,
  };

  console.log(JSON.stringify(objectToSend));

  return postToAPI(TRIP_EVENT_URI, objectToSend);

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
        .end((err, res) => {
          if(err) {
            console.log(err);
            return reject(err);
          }
          return resolve(res);
        });
    });
  });
}
