
//import RealmHelper, { queryRecord } from '../../database/RealmHelper';
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';
import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';

const fishingEventDB = new RealmHelper('fishingEvent');
const tripDB = new RealmHelper('trip');
const productDB = new RealmHelper('product');
const discardDB = new RealmHelper('discard');
const vesselDB = new RealmHelper('vessel');
const protectedDB = new RealmHelper('protected');
const userDB = new RealmHelper('user');
const connectionSettingsDB = new RealmHelper('connectionSettings');
const portDB = new RealmHelper('port');
const speciesDB = new RealmHelper('species');

const addItemToEvent = (fishingEvent, model, attributeName, realmDB) =>
  fishingEventDB.addToList(
    fishingEvent, [realmDB.create(blankModel(model))], attributeName);

function setActiveConnection(activeProviderName) {

  //const allSettings = queryRecord('connectionSettings', 'active = true');
  //allSettings.forEach(cs => connectionSettingsDB.update(cs, { active: false }));

  //const activeSettings = queryRecord('connectionSettings', `name = '${activeProviderName}'`).slice(0);
//  connectionSettingsDB.update(activeSettings, { active: true });
}

export default function RealmMiddleware({ dispatch, getState }) {

  return (next) => (action, state) => {
    const { type, realm, payload } = action;
    switch (type) {
      case 'updateSpecies':
        speciesDB.deleteAll()
        action.payload.species.forEach((s) => {
          speciesDB.create({ code: s.code, fullName: s.description });
        });
        break;
      case 'updatePorts':
        portDB.deleteAll();
        action.payload.ports.forEach((p) => {
          portDB.create({ name: p.name, id: p.id });
        });
        break;
      case 'updateVessels':
        action.payload.vessels.forEach((v) => {
          console.log("vessels", v);
          vesselDB.deleteAll();
          vesselDB.create({ name: v.name, id: v.id, registration: `${v.registration}` });
        });
        break;
      case 'updateUser':
        userDB.deleteAll();
        userDB.create(payload.changes);
        break;
      case 'updateVessel':
        vesselDB.update(realm, payload.changes);
        break;
      case 'endTrip':
        tripDB.update(realm, payload.changes);
        tripDB.create(payload.newTrip);
        break;
      case 'startTrip':
      case 'update-trip':
        
        //tripDB.update(realm, payload.changes);
        break;
      case 'startFishingEvent':
        const startedEvent = fishingEventDB.create(realm.newEvent);
        tripDB.addToList(realm.trip, [startedEvent],
                         'fishingEvents');
        break;
      case 'updateFishingEvent':
      case 'endFishingEvent':
        fishingEventDB.update(realm, payload.changes);
        break;
      case 'repeatEventCatches':
        const newCatches = payload.changes.estimatedCatch.map(
            es => productDB.create({ code: es.code, weight: 0, state: es.state }));
        fishingEventDB.addToList(
          realm,
          newCatches,
          'estimatedCatch'
        );
        break;
      case 'deleteFishingEvent':
        fishingEventDB.delete(realm);
        break;
      case 'updateProduct':
        productDB.update(realm, payload.changes);
        break;
      case 'updateDiscard':
        discardDB.update(realm, payload.changes);
        break;
      case 'updateProtected':
        protectedDB.update(realm, payload.changes);
        break;
      case 'addProduct':
        addItemToEvent(realm, ProductModel, 'estimatedCatch', productDB);
        break;
      case 'addDiscard':
        addItemToEvent(realm, DiscardModel, 'discards', discardDB);
        break;
      case 'addProtected':
        addItemToEvent(realm, ProtectedModel, 'protecteds', protectedDB);
        break;
      case 'deleteProduct':
        productDB.delete(realm);
        break;
      case 'deleteDiscard':
        discardDB.delete(realm);
        break;
      case 'deleteProtected':
        protectedDB.delete(realm);
        break;
      case 'setActiveConnection':
        setActiveConnection(payload.name);
        break;

    }
    return next(action);
  }

}
