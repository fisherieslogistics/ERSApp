import PouchDB from 'pouchdb-react-native';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
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
  'setCurrentFishingEvents',
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
    console.log('changes CHANGE', changes, 'changes CHANGE');
  }

  handleComplete(changes) {
    
  }
  
  /*reateFishingEventByTripIdIndex() {
    return this.localDB.createIndex({
      index: {
        fields: ['trip_id', 'document_type'],
      },
    });
  }*/
  
  setCurrentFishingEvents(trip_id) {
    
    return this.localDB.find({
      selector: {
        $and: [
          { trip_id },
          { document_type: 'fishingEvent' },
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
    }).catch(err => {
      console.log(err);
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
    console.log(`update-${doc.document_type}`, doc);
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
  
  dispatchDelete(doc) {
    this.dispatch({
      type: `delete-${doc.document_type}`,
      payload: { changes: doc },
    });
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
