import request from 'superagent';
import { privateKeyPem, publicKeyPem } from './keys';
import moment from 'moment';
const CLIENT_NUMBER = 9900159;
const TIME_TO_WAIT = 3000;
const TRWAL_EVENT_URI = `https://ers.demo.kupe.fishserve.co.nz/api/${CLIENT_NUMBER}/event/v1/trawl/`;
const HAND_GATHER_URI = `https://ers.uat.kupe.fishserve.co.nz/api/${CLIENT_NUMBER}/event/v1/hand-gathering/`;
const START_TRIP_URI = `https://ers.uat.kupe.fishserve.co.nz/api/${CLIENT_NUMBER}/event/v1/trip-start/`;
const END_TRIP_URI = `https://ers.uat.kupe.fishserve.co.nz/api/${CLIENT_NUMBER}/event/v1/trip-end/`;
const LOGBOOK_REGISTRATION_URI = 'https://ers.uat.kupe.fishserve.co.nz/api/security/log-book-registration';
const SOFTWARE_INSTALLATION_ID = '5b3a58e2-2291-4acc-9fda-9197f52a81ec';
//Events all need eventId appened to them
//Trip Start Example
const USER_NAME = 'boddyr';
const PASSWORD = 'Logisticsf1';
const VESSEL_NUMBER = '44695';
const KUPE_USER_ID = '9050';




const toBind = [
  'onSuccess',
  'onFail',
  'start',
]

export default class Fishserve {

  constructor() {
    toBind.forEach((funcname) => {
      this[funcname] = this[funcname].bind(this);
    })
    //this.start();
  }

  getNextAction() {
    //console.log("get next action")
    return actionToSendDB.findOneWhere(' fishserveUpdated != true ', 'timestamp');
  }

  onSuccess(result, actionToSend) {
    const update = { fishserveUpdated: true, fishserveUpdated_date: new Date() };
    actionToSendDB.update(actionToSend, update);
    this.restart();
  }

  onFail(err, actionToSend) {
    this.restart()
  }

  restart() {
    setTimeout(this.start, TIME_TO_WAIT);
  }

  start() {
    const nextAction = this.getNextAction();
    if(!nextAction) {
      this.restart()
      return;
    }
    const task = getTaskFromAction(nextAction.type, JSON.parse(nextAction.payload));
    if(task) {
      task.then(res => this.onSuccess(res, nextAction)).catch(err => this.onFail(err, nextAction));
      return;
    }
    this.onSuccess(null, nextAction);
  }
}

export function getTaskFromAction(type, payload) {
  switch (type) {
    case 'commitFishingEvent':
      const eventObj = {
        clientNumber: CLIENT_NUMBER,
        eventID: payload.RAId,
      };
      const createEventRequest = createEvent(eventObj);
      return updateFishserve(createEventRequest);
    case 'updateFishingEvent':
      return null;
    default:
      return null;
  }
}

export function updateFishserve(updateRequest) {
  return new Promise((resolve, reject) => {
    auth({ username: 'RimuB', 'password': 'Logistics1' })
      .then(token => {
        updateRequest
          .set('Authorization ', `Bearer ${token}`)
          .end((err, res) => {
          if(err) {
            reject(err);
            return;
          }
          resolve(res);
        });
      });
  });

}


function auth() {
  const body = {
    'username': `${USER_NAME}`,
    'password': `${PASSWORD}`,
  };
  ////console.log(body, 'auth it');
  return new Promise((resolve, reject) => {
    request.post(`https://api.uat.kupe.fishserve.co.nz/authenticate`)
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, res) => {
        console.log()
        if(err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(res.text).userToken);
      });
  });
}

function registerLogbookRequest(token) {
  return new Promise((resolve, reject) => {
    request.post(LOGBOOK_REGISTRATION_URI)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      "SoftwareVendor": "Fishery Logistics",
      "DeviceName": "Catch Hub 9001",
      "SoftwareInstallationId" : SOFTWARE_INSTALLATION_ID,
      "PublicKey": publicKeyPem,
    }).end((err, res) => {
      if(err || res.status !== 200) {
        return reject({err, errors: res.body.errors});
      }
      resolve(res);
    });
  });
}

function createStartTripRequest(trip, payload, token, signature) {
  //"https://ers.uat.kupe.fishserve.co.nz/api/1234567/event/v1/trip-start/
  //GET https://ers.uat.kupe.fishserve.co.nz/api/1234567/event/v1/trip-start/EventId099?softwareInstallationId=74be4716-cd8f-4264-83e4-5b1249082900&CompleterUserId=8979
  //const url = `${START_TRIP_URI}${trip_id}`;
  //const params = `?softwareInstallationId=${SOFTWARE_INSTALLATION_ID}&CompleterUserId=${KUPE_USER_ID}`;

  const url = `https://ers.uat.kupe.fishserve.co.nz/api/${CLIENT_NUMBER}/event/v1/trip-start/${trip_id}`;//5ba04c30-c81a-4618-898e-e832da93cf91

  return request.post(url)
    .set('Content-Type', 'application/json')
    .set('Signature', signature)
    .set('Accept', 'application/json')
    .set('Software-Vendor', 'Fishery Logistics')
    .set('Software-Version', '1.0.0.0')
    .set('Software-Installation-Id', SOFTWARE_INSTALLATION_ID)
    .send(payload)
}

function createEvent(JSON, URI) {
  const eventToSend = fishingEventDB.findOne(eventID);
  console.log("I has event ID", eventToSend.RAId);
  return request
    .post(URI)
    .set('X-API-Key', 'foobar')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Software-Vendor', 'FisheryLogistics')
    .set('Software-Version', '1.0.0.0')
    .set('Software-Installation-Id', SOFTWARE_INSTALLATION_ID)
    .send(eventToSend.fishServeObject)
}

export function createEndTripEvent() {

}

export function registerApp() {
  return new Promise((resolve, reject) => {
    auth()
      .then((token) => {
        return registerLogbookRequest(token)
          .then((res) => {
            console.log(res);
            resolve(res);
          }).catch((err) => {
            console.log(err);
          });
      });
  })
}

export function createStartTripEvent(trip) {

  const json = '{"eventHeader":{"eventId":"TripStart-aa58aca0-99c3-11e7-b6c4-6fd681ce18aa","tripId":"aa58aca0-99c3-11e7-b6c4-6fd681ce18aa","completedDateTime":"2017-09-15T15:12:30+12:00","vesselNumber":"44695","isVesselUsed":true,"notes":"Some notes.","softwareVendor":"Fishery Logistics","softwareVersion":"1.0.0.0","softwareInstallationId":"5b3a58e2-2291-4acc-9fda-9197f52a81ec","clientNumber":9900159,"completerUserId":"9050"},"personInCharge":"Rick Burch","startLocation":{"systemDateTime":"2017-09-15T15:12:30+12:00","systemLocation":{"longitude":"-175.5423","latitude":"-45.9880"},"manualDateTime":null,"manualLocation":null}}';
  const req = createStartTripRequest(trip_id, json, signature);
  req.end((err, res) => {
    console.log(err, res);
  });
}

/*  const payload = {
    "eventHeader": {
      "eventId": `TripStart-${trip.RAId}`,
      "tripId": trip.RAId,
      "completedDateTime": moment().format(),
      "vesselNumber": VESSEL_NUMBER,
      "isVesselUsed": true,
      "notes": "Some notes.",
      "softwareVendor": "Fishery Logistics",
      "softwareVersion": "1.0.0.0",
      "softwareInstallationId": SOFTWARE_INSTALLATION_ID,
      "clientNumber": CLIENT_NUMBER,
      "completerUserId": KUPE_USER_ID,
    },
    "personInCharge": "Rick Burch",
    "startLocation": {
      "systemDateTime": moment(trip.startTime).format(),
      "systemLocation": {
        "longitude": "-175.5423",
        "latitude": "-45.9880"
      },
      "manualDateTime": null,
      "manualLocation": null
   }
  }*/








//.send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
//POST https://ers.demo.kupe.fishserve.co.nz/api/{clientNumber}/event/v1/trawl/{eventID}/
//POST https://ers.demo.kupe.fishserve.co.nz/api/1234567/event/v1/trawl/5ba04c30-c81a-4618-898e-e832da93cf98
