import PouchDB from 'pouchdb-react-native';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
import { setInitialTrips } from '../actions/TripActions';
import uuid from 'uuid/v1';
import { update } from '../reducers/GeneralMethods';
import { relayErrorMessage } from '../api/RestApi';

const REMOTE_URI = 'http://localhost:5984/';
const APP_STATE_ID = 'AppState';

const toBind = [
  'setCurrentTrip',
  'setupReduxState',
  'setupInitialTrip',
  'setCurrentFishingEvents',
];

export default class Pouch {

  constructor(dispatch) {
    this.dispatch = dispatch;
    this.localDB = new PouchDB('reporting');
    this.remoteDB = new PouchDB(REMOTE_URI, { auth: {
      username: 'replicator',
      password: 'fishplicator'
    }});
    toBind.forEach(k => {
      this[k] = this[k].bind(this);
    });
  }

  setupSync() {
    this.localDB.sync(this.remoteDB, {
      live: true,
      retry: true
    });
  }

  handleChange(changes) {
    console.log('changes CHANGE', changes, 'changes CHANGE');
  }

  handleComplete(changes) {

  }

  setCurrentFishCatches(fishingEvents, resolve, reject) {
    console.log([...fishingEvents].map(f => f._id));
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

  setCurrentFishingEvents(trip_id) {

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
            changes: results.docs,
          }
        });

        next(results.docs, resolve, reject);

      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  createFishCatchByEventIdIndex() {
    return this.localDB.createIndex({
      index: {
        fields: ['fishingevent_id', 'document_type'],
      },
    });
  }

  setupListeners() {
    this.localDB.changes({
      live: true,
      include_docs: true
    }).on('change', this.handleChange.bind(this))
      .on('complete', this.handleComplete.bind(this))
      .on('error', console.log.bind(console, '[Change:Error]'))
  }

  getAllDocIds() {
    return this.localDB.allDocs({ include_docs: false });
  }

  setupInitialTrip() {

    const newTrip = {
      _id: uuid(),
      personInCharge: 'Ian',
      ETA: null,
      datetimeAtStart: null,
      datetimeAtEnd: null,
      startLocation: null,
      endLocation: null,
      leavingPort: null,
      unloadPort: null,
      vessel: null,
      document_type: 'trip',
    };

    const appState = {
      _id: APP_STATE_ID,
      currentTrip: newTrip._id,
      currentFishingEvents: [],
    };

    return Promise.all([
      this.localDB.put(newTrip),
      this.localDB.put(appState),
    ]).then(results => {
      this.setupReduxState();
    });
  }



  setItems({ ports, vessels, user, species }) {
    user._id = uuid();
    return this.replaceItems(ports, 'ports').then(() =>
      this.replaceItems(vessels, 'vessels')).then(() =>
        this.replaceItems(species, 'species')).then(() =>
          this.replaceItems([user], 'users'));

  }

  bulkInsert(insertable) {
    return this.localDB.bulkDocs(insertable).catch(err =>  { throw(err) })
  }

  replaceItems(items, type){
    const insertable = items.map(
      i => Object.assign({}, i, { _id: i.id || uuid(), type, }));

    return this.deleteAllOfType(type).then(this.bulkInsert(insertable));
  }

  deleteAllOfType(type) {
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

  get(_id) {
    return this.localDB.get(_id);
  }

  setCurrentTrip(appState) {
    this.localDB.get(appState.currentTrip).then(currentTrip => {
      this.dispatch({ type: 'setCurrentTrip', payload: {
        changes: currentTrip,
      }});
      this.setCurrentFishingEvents(currentTrip.id);
    });
  }

  create(itemToCreate) {
    if(!itemToCreate._id) {
      itemToCreate._id = uuid();
    }
    return this.localDB.put(itemToCreate).then((res) => {
      console.log(res);
      this.localDB.get(res.id).then(newestdoc => {
        this.dispatchCreate(newestdoc);
      });
    }).catch(err => {
      relayErrorMessage(err);
    });
  }

  dispatchUpdate(doc) {
    this.dispatch({
      type: `update-${doc.document_type}`,
      payload: { changes: doc },
    });
  }

  dispatchCreate(doc) {
    this.dispatch({
      type: `create-${doc.document_type}`,
      payload: { changes: doc },
    });
  }

  dispatchDelete(_id, document_type) {
    this.dispatch({
      type: `delete-${document_type}`,
      payload: { changes: _id },
    });
  }

  delete(_id, document_type) {
    this.localDB.get(_id).then(
      doc => this.localDB.remove(doc).then(
        () => this.dispatchDelete(_id, document_type)));
  }

  update(change, _id) {
    change._id = _id;
    this.localDB.get(_id).then(doc => {

      const newdoc = update(doc, change);
      return this.localDB.put(newdoc).then((res) => {

        this.localDB.get(res.id).then(newestdoc => {

          console.log('dispatchUpdate')
          this.dispatchUpdate(newestdoc);

        });

      }).catch((err) => {
        console.log(err);
      });
    });
  }

  setupReduxState() {
    this.localDB.get(APP_STATE_ID).then(appState => {
      this.setCurrentTrip(appState);
    });
  }

}
