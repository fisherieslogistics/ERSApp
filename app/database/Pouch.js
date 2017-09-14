import PouchDB from 'pouchdb-react-native';
import { setInitialTrips } from '../actions/TripActions';
import uuid from 'uuid/v1';
import { update } from '../reducers/GeneralMethods';
import { relayErrorMessage } from '../api/RestApi';

const REMOTE_URI = 'http://localhost:5984/reporting';
const APP_STATE_ID = 'AppState';

const toBind = [
  'setCurrentTrip',
  'setupReduxState',
  'setupInitialTrip',
];

export default class Pouch {

  constructor(dispatch) {
    this.dispatch = dispatch;
    this.localDB = new PouchDB('reporting');
    this.remoteDB = new PouchDB(REMOTE_URI, { auth: {
      username: 'reporting',
      password: 'reportingadmin'
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
    console.log('there is changes', changes);
    //console.log('changes CHANGE', changes, 'changes CHANGE');
  }

  handleComplete(changes) {
    //console.log('changes COMPLETED', changes, 'changes COMPLETED');
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
      startTime: null,
      endTime: null,
      startLocation: null,
      endLocation: null,
      leavingPort: null,
      unloadPort: null,
      vessel: null,
      type: 'trip',
    };

    const appState = {
      _id: APP_STATE_ID,
      currentTrip: newTrip._id,
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
    });
  }

  create(itemToCreate, type) {
    if(!itemToCreate._id) {
      itemToCreate._id = uuid()
    }
    return this.localDB.put(newdoc).then((res) => {
      console.log(res);
    }).catch(err => {
      relayErrorMessage(err);
    });
  }

  dispatchUpdate(doc) {
    console.log('dispatchUpdate', doc);
    this.dispatch({
      type: `update-${doc.type}`,
      payload: { changes: doc }
    });
  }

  update(change, _id) {
    change._id = _id;
    this.localDB.get(_id).then(doc => {

      const newdoc = update(doc, change);
      return this.localDB.put(newdoc).then((res) => {

        this.localDB.get(res.id).then(newestdoc => {
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

  getCurrentFishingEvents(tripId) {

  }

  getAllTrips() {

  }

  /*localDB.allDocs({include_docs: true})
    .then(results => {
      const trips = results.filter(row => row.doc.type === 'trip');

      this.dispatch(setInitialTrips(trips));

    }).catch(err => console.log.bind(console, '[Fetch all]'));



    syncStates.forEach(state => {
      sync.on(state, setCurrentState.bind(this, state));

      function setCurrentState(state) {
        console.log('[Sync:' + state + ']');

        this.setState({
          syncStatus: state
        });
      }
    });*/

}
