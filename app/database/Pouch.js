import PouchDB from 'pouchdb-react-native';
import { AlertIOS } from 'react-native';
import { NativeEventEmitter } from 'react-native';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
import TrawlEvent from '../models/addons/TrawlEvent';
import uuid from 'uuid/v1';
import { update } from '../reducers/GeneralMethods';
import jwtDecode from 'jwt-decode';
import TripModel from '../models/TripModel';
import { blankModel } from '../utils/ModelUtils';

const SERVER = 'https://test.catchhub.com:5985/';
//
const USER_REMOTE_URI = SERVER + 'user_db';
//this contains: species
const MASTER_REMOTE_URI = SERVER + 'master_db';
//this contains: vessels, ports
const ORG_REMOTE_URI = SERVER + 'org_db';
//'https://test.catchhub.com:5984/user_4';

//const USER_REMOTE_URI = 'http://localhost:5985/user_4';
//this contains: species
//const MASTER_REMOTE_URI = 'http://localhost:5985/master_data';
//this contains: vessels, ports
//const ORG_REMOTE_URI = 'http://localhost:5985/org_4e5f23bc-f1e0-4845-aee0-f2b2a26b004b';
//'https://test.catchhub.com:5984/user_4';
//const REMOTE_URI = 'http://test.catchhub.com:5984/user_db';
const APP_STATE_ID = 'AppState';


export default class Pouch {

  constructor(dispatch, token) {
    const user = jwtDecode(token);
    console.log(token);
    this.user = user;
    this.dispatch = dispatch;
    this.localDB = new PouchDB('user_db');
    this.masterDB = new PouchDB('master_data');
    this.orgDB = new PouchDB('org_db');
  }

  setupSync = (token) => {
    this.localDB.setMaxListeners(50);
    const options = {
      live: false,
      //retry: true,
      //gzip: true,
      ajax: {
        headers: {
          'Authorization': token,
        },
      },
    };

    this._sync = this.localDB.replicate.to(USER_REMOTE_URI, options)
      .on('error', error => console.error('Sync Error', error))
      .on('paused', info => console.log('Sync paused', info))
      .on('completed', info => console.log('Sync completed', info))
      .on('denied', info => console.log('Sync Denied', info))
      .on('active', info => console.log('Sync active', info))
      .on('change', info => {
        //console.log('Sync change', info);
      });

    this._orgSync = this.orgDB.replicate.from(ORG_REMOTE_URI, options)
      .on('error', error => console.error('Sync ORG Error', error))
      .on('paused', info => console.log('Sync ORG paused', info))
      .on('completed', info => console.log('Sync org completed', info))
      .on('denied', info => console.log('Sync ORG Denied', info))
      .on('active', info => console.log('Sync ORG active', info))
      .on('change', info =>  {
        console.log("org sync change");
        //this.setVessels();
        //this.setPorts();
      });


    this._masterSync = this.masterDB.replicate.from(MASTER_REMOTE_URI, options)
      .on('error', error => console.error('Sync MASTER Error', error))
      .on('paused', info => console.log('Sync MASTER paused', info))
      .on('completed', info => console.log('Sync master completed', info))
      .on('denied', info => console.log('Sync MASTER Denied', info))
      .on('active', info => console.log('Sync active', info))
      .on('change', info => {
        this.setSpecies();
      });

    return this._sync;
  }

  setCurrentFishCatches = (fishingEvents, resolve, reject) => {
    this.localDB.find({
      selector: {
        $and: [
          { fishingEvent_id: { $in: fishingEvents.map(f => f._id) } },
          { document_type: 'fishCatch' },
          { archived: { $ne: true } },
        ],
        sort: 'weightKgs',
      },
    }).then(results => {
      this.dispatch({
        type: 'setFishCatches',
        payload: {
          changes: results.docs,
        }
      });
      resolve()
    }).catch(err => {
      console.log(err);
      reject(err);
    });
  }

  setupMasterData() {
    return Promise.all([this.setPorts(), this.setSpecies(), this.setVessels()]);
  }

  setPorts() {
    return new Promise((resolve, reject) => {
      this.getPorts().then(data => {
        const ports = data.docs.map(
          p => ({ value: p.name, description: '', _id: p._id, id: p.id }));
        this.dispatch({ type: 'setPorts', payload: { changes: ports }});
        resolve(ports);
      });
    });
  }

  setVessels() {
    return new Promise((resolve, reject) => {
      return this.getVessels().then(data => {
        resolve(data.docs);
        this.dispatch({ type: 'setVessels', payload: { changes: data.docs }});
      });
    });
  }

  setSpecies() {
    return new Promise((resolve, reject) => {
      this.getSpecies().then(data => {
        const species = data.docs.map(
          p => ({ value: p.code, description: p.description, _id: p._id, id: p.id }));
        this.dispatch({ type: 'setSpecies', payload: { changes: species }});
        resolve(species);
      });
    });
  }

  getPorts = () => {
    const selector = { selector: { table_name: { $eq: 'reporting_port' }}};
    return this.orgDB.find(selector);
  }

  getVessels = async () => {
    const selector = { selector: { table_name: { $eq: 'reporting_vessel' }}};
    return this.orgDB.find(selector);
  }

  getSpecies = () => {
    const selector = { selector: { table_name: { $eq: 'reporting_species' }}};
    return this.masterDB.find(selector);
  }

  setCurrentFishingEvents = (trip_id) => {

    const next = (fishingEvents, resolve, reject) => {
      return this.setCurrentFishCatches(fishingEvents, resolve, reject);
    };

    return new Promise((resolve, reject) => {

      this.localDB.find({
        selector: {
          $and: [
            { trip_id },
            { document_type: 'fishingEvent' },
            { archived: { $ne: true } },
          ],
          sort: 'numberInTrip',
        },
      }).then(results => {

        this.dispatch({
          type: 'setFishingEvents',
          payload: {
            changes: results.docs.map(d => new TrawlEvent(d)),
          }
        });

        next(results.docs, resolve, reject);

      }).catch(err => {
        reject(err);
      });
    });
  }

  getAllDocIds = () => {
    return this.localDB.allDocs({ include_docs: false });
  }

  setupInitialTrip = async () => {
    const vessels = await this.getVessels();
    const vessel = vessels.docs[0] || { name: 'no vessel', registration: '0', _id: '000' };
    const newTrip = blankModel(TripModel);
    const { user_id, username } = this.user;
    const values = {
      personInCharge: username,
      vessel_id: vessel.id,
      document_type: 'trip',
      active: 'true',
      active: true,
    };
    const trip = await this.create(Object.assign({}, newTrip, values));
    return trip;
  }

  bulkInsert = (insertable) => {
    return this.localDB.bulkDocs(insertable).catch(err =>  { throw(err) })
  }

  replaceItems = (items, type) => {
    const insertable = items.map(
      i => Object.assign({}, i, { _id: i.id || uuid(), type, }));

    return this.deleteAllOfType(type).then(this.bulkInsert(insertable));
  }

  deleteAllOfType = (type) => {
    return this.localDB.allDocs({include_docs: true}).then((allDocs) => {
      const toDel = allDocs.rows.filter(row => row.type === type).map(
        (r) => {
          return {_id: row.id, _rev: row.doc._rev, _deleted: true};
        });
      return toDel;
    }).then(
      deleteDocs => this.localDB.bulkDocs(deleteDocs)
        .catch(err => { throw(err) }));
  }

  get = (_id) => {
    return this.localDB.get(_id);
  }

  setCurrentTrip = (appState) => {
    this.localDB.get(appState.currentTrip).then(currentTrip => {
      this.dispatch({ type: 'setCurrentTrip', payload: {
        changes: currentTrip,
      }});
      this.setCurrentFishingEvents(currentTrip.id);
    });
  }

  create = (itemToCreate) => {
    itemToCreate._id = uuid();
    itemToCreate.createdAt = new Date();
    itemToCreate.creator = this.user.id;
    itemToCreate.id = itemToCreate._id;
    itemToCreate.organisation_id = this.user.organisation_id;

    return new Promise((resolve, reject) => {
      this.localDB.put(itemToCreate).then((res) => {
        this.localDB.get(res.id).then(newestdoc => {
          this.dispatchCreate(newestdoc);
          resolve(newestdoc);
        });
      });
    });
  }

  dispatchUpdate = (doc) => {
    this.dispatch({
      type: `update-${doc.document_type}`,
      payload: { changes: doc },
    });
  }

  dispatchCreate = (doc) => {
    this.dispatch({
      type: `create-${doc.document_type}`,
      payload: { changes: doc },
    });
  }

  dispatchDelete = (_id, document_type) => {
    this.dispatch({
      type: `delete-${document_type}`,
      payload: { changes: _id },
    });
  }

  delete = (_id, document_type) => {
    return this.localDB.get(_id)
               .then(
                 doc => this.localDB.remove(doc).then(
                   () => this.dispatchDelete(_id, document_type)))
               .catch((err) => console.log(err, _id, "not founf dor delete"));
}

  update = (change, _id) => {
    change._id = _id;
    change.updatedAt = new Date();
    return this.localDB.get(_id).then(doc => {

      const newdoc = update(doc, change);
      return this.localDB.put(newdoc).then((res) => {

        return this.localDB.get(res.id).then(newestdoc => {
          this.dispatchUpdate(newestdoc);
        });

      }).catch((err) => {
        console.log("update etrr", err, change, _id);
      });
    });
  }

  createNewState = async () => {
    const trip = await this.setupInitialTrip();
    console.log("got trip");
    const vessels = await this.getVessels();
    console.log("got vessels");
    const appState = {
      _id: APP_STATE_ID,
      currentTrip: trip._id,
      vessel: vessels[0],
      currentFishingEvents: [],
    };
    await this.delete(APP_STATE_ID);
    console.log("deleted app state");

    await this.localDB.put(appState);
    return this.setCurrentTrip(appState);
  }

  setupReduxState = () => {
    return this.localDB.get(APP_STATE_ID).then((appState) => {
      return this.localDB.get(appState.currentTrip).then((trip) => {
        if(trip) {
          return this.setCurrentTrip(appState);
        }
      }).catch((err) => {
        console.log("no trip");
        return this.createNewState();
      });

    }).catch((err) => {
      console.log("no appp state");
      return this.createNewState();
    });
  }

}
