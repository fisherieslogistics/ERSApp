
import { AsyncStorage } from 'react-native';
import { updateUser } from '../actions/UserActions';
import UserModel from '../models/UserModel';
import TripModel from '../models/TripModel';
import VesselModel from '../models/VesselModel';
import ConnectionSettingsModel from '../models/ConnectionSettingsModel';
import activeSetting from '../constants/connectionSettings/activeSetting';
import { iosNative, sierraWireless, navicom } from '../constants/connectionSettings/settings';
import { blankModel } from '../utils/ModelUtils';


function createIfNone(name, model) {
  const items = getRecords(name);
  if(!items.length) {
    createRecord(name, blankModel(model));
  }
}

function addSettings() {
  const settings = getRecords('connectionSettings');
  if(settings.length >= 3) {
    return;
  }
  [iosNative, sierraWireless, navicom].forEach(s => {
    const activeNess = { active: (activeSetting === s.name) };
    const setting = blankModel(ConnectionSettingsModel);
    const toSave = Object.assign({}, setting, s, activeNess);
    createRecord('connectionSettings', toSave);
  });
}

function setup(auth) {

  return new Promise(resolve => {
    const user = blankModel(UserModel);
    /*user.email = "roger@nzclams.com";//auth.profile.email;
    user.auth0ID = "234325235325";//auth.profile.userId;
    user.firstName = "Roger";//auth.profile.extraInfo.user_metadata.first_name;
    user.lastName = "Belton";//auth.profile.extraInfo.user_metadata.last_name;*/
    createRecord('user', user);
    createIfNone('trip', TripModel);
    createIfNone('vessel', VesselModel)
    addSettings();
    AsyncStorage.setItem('initialSetup', "true", () => resolve(true));
  });

}

export default function initialSetup(auth) {
  return new Promise((resolve) => {
    AsyncStorage.getItem('initialSetup', (err, state)=>{
      if(state) {
        return resolve();
      }
      setup(auth).then(() => resolve());
    });
  });

}
