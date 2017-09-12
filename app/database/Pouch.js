import PouchDB from 'pouchdb-react-native';
import { setInitialTrips } from '../actions/TripActions';
import uuid from 'uuid/v1';
import { update } from '../reducers/GeneralMethods'
const REMOTE_URI = 'http://localhost:5984/reporting';
const APP_STATE_ID = 'AppState';

const toBind = [
  'setCurrentTrip',
  'setupReduxState',
]

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
    console.log(changes)
  }

  handleComplete(changes) {

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

  setCurrentTrip(appState) {
    this.localDB.get(appState.currentTrip).then(currentTrip => {
      this.dispatch({ type: 'setCurrentTrip', payload: {
        changes: currentTrip,
      }});
    });
  }

  update(change, _id) {
    change._id = _id;
    this.localDB.get(_id).then(doc => {

      const newdoc = update(doc, change);
      return this.localDB.put(newdoc).then((res) => {

        this.localDB.get(res.id).then(newestdoc => {
          switch (newestdoc.type) {
            case 'trip':
              this.dispatch({
                type: 'setCurrentTrip',
                payload: { changes: newestdoc }
              });
              break;
            default:
          }

        });

      }).catch((err) => {
        console.log(err);
      });
    });
  }

  setupReduxState() {
    this.localDB.get(APP_STATE_ID).then(appState => {
      this.setCurrentTrip(appState);
    }).catch(err => {
      console.log(err);
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
