import request from 'superagent';
import AsyncStorage from 'AsyncStorage';
import Helper from '../utils/Helper';
import SERVER_URL from '../constants/ServerURL';

const USER_NAME = 'testskipper';
const PASSWORD = 'pwnallthefesh';

const PERSON_IN_CHARGE = 'Skipper King';
const VESSELS_URI = SERVER_URL + 'rest-api/vessels/';
const PORTS_URI = SERVER_URL + 'rest-api/ports/';
const SPECIES_URI = SERVER_URL + 'rest-api/species/';
const USERS_URI = SERVER_URL + 'rest-api/users/';

export function relayErrorMessage(err) {
  console.warn(err);
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
