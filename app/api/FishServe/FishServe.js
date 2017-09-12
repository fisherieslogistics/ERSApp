/*import request from 'superagent';
const CLIENT_NUMBER = 9900113;
const TIME_TO_WAIT = 3000;
const toBind = [
  'onSuccess',
  'onFail',
  'start',
]*/

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


function auth({ username, password }) {
  const body = {
    'username': `${username}`,
    'password': `${password}`,
  };
  ////console.log(body, 'auth it');
  return new Promise((resolve, reject) => {
    request.post(`https://api.demo.kupe.fishserve.co.nz/authenticate`)
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, res) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(res.text).userToken);
      });
  });
}

export function createEvent({ clientNumber, eventID }) {
  const eventToSend = fishingEventDB.findOne(eventID);
  console.log("I has event ID", eventToSend.RAId);
  const req = request
    .post(`https://ers.demo.kupe.fishserve.co.nz/api/${clientNumber}/event/v1/trawl/${eventID})`)
    .set('X-API-Key', 'foobar')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Software-Vendor', 'Fishery Logistics')
    .set('Software-Version', '1.0.0.0')
    .set('Software-Installation-Id', 'a13afab2-c409-4622-kkkk46996587809')
    .send(eventToSend.fishServeObject)
  return req;
}


//.send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
//POST https://ers.demo.kupe.fishserve.co.nz/api/{clientNumber}/event/v1/trawl/{eventID}/
//POST https://ers.demo.kupe.fishserve.co.nz/api/1234567/event/v1/trawl/5ba04c30-c81a-4618-898e-e832da93cf98
