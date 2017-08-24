'use strict';
import React, {
  Component,
} from 'react';
import {
  View,
  StatusBar,
  Text,
  AlertIOS,
} from 'react-native';
import AsyncStorage from 'AsyncStorage';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import request from 'superagent';
import ReportingApp from './ReportingApp';
import SplashScreen from '../components/SplashScreen';
import ConnectionMiddleware from '../reducers/middlewares/ConnectionMiddleware';
import RealmMiddleware from '../reducers/middlewares/RealmMiddleware';
import AddUsefulToActions from '../reducers/middlewares/AddUsefulToActions';
import { startConnection } from '../actions/ConnectionActions';
import { updateAuth } from '../actions/AuthActions';
import { updateUser } from '../actions/UserActions';
import { startRealm } from '../database/realmDB';
import initialSetup from '../database/initialSetup';
import { getLastRecord } from '../database/RealmHelper';
import iOSLocation from '../api/location/iOSLocation';
import { getPorts, getSpecies, getVessels } from '../api/RestApi';
import { updatePorts } from '../actions/PortActions';
import { updateSpecies } from '../actions/SpeciesActions';
import { updateVessels } from '../actions/VesselActions';
//import ErrorUtils from 'ErrorUtils';
import { reducers } from '../reducers/main';
const createStoreWithMiddleware = applyMiddleware(thunk, AddUsefulToActions, ConnectionMiddleware, RealmMiddleware)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
const blackBack = { backgroundColor: 'black' };
const errorsStyle = { backgroundColor: 'red', height: 90, width: 768, paddingTop: 20 };


const LOGIN_URI = 'http://localhost:8000/api-token-auth/';
/*function setUpErrorHandler(handleError) {
  //ErrorUtils.setGlobalHandler(handleError);
}*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.renderErrors = this.renderErrors.bind(this);
    this.onLoggedIn = this.onLoggedIn.bind(this);
    this.iosLocation = new iOSLocation();
  }

  componentDidMount() {
    this.iosLocation.addCallbacks((nmeStr) => {
      //console.log("messageCallback", nmeStr);
    },
    (err) => {
      console.log("locErr", err);
    });
    this.login();
  }

  onLoggedIn(token) {
    //store.dispatch(updateAuth(auth));
    //const user = getLastRecord('user');
    //store.dispatch(updateUser('firstName', user.firstName, user));
    //store.dispatch(updateUser('lastName', user.lastName, user));
    //store.dispatch(updateUser('email', user.email, user));
    startRealm();
    initialSetup().then(() => {
      AsyncStorage.setItem('refreshToken', token, () => {
        Promise.all([getPorts(), getSpecies(), getVessels()]).then((values) => {
          console.log('ports', values[0]);
          store.dispatch(updatePorts(values[0]));
          console.log('species', values[1]);
          store.dispatch(updateSpecies(values[1]));
          console.log('vessels', values[2]);
          store.dispatch(updateVessels(values[2]));
          this.setState({
            loggedIn: true,
          });
          store.dispatch(startConnection());
        });
      });
    });

  }

  login() {
    AsyncStorage.getItem('refreshToken', (err, refreshToken) => {
      if(!refreshToken) {
        this.promptUsername();
        console.log("all the things", this.state);
      } else {
        this.onLoggedIn(refreshToken);
      }
    });
  }

  getRefreshToken() {
    request.post(LOGIN_URI)
      .set("Content-Type", "application/json")
      .send({ username: this.state.username, password: this.state.password })
      .end((err, res) => {
        if(res && res.body && res.body.token) {
          this.onLoggedIn(res.body.token);
        }
      });
  }

  promptUsername() {
    AlertIOS.prompt(
      'Enter Username',
      null,
      (username) => {
        this.setState({ username });
        this.promptPassword();
      },
    );
  }

  promptPassword() {
    AlertIOS.prompt(
      'Enter Password',
      null,
      (password) => {
        this.setState({ password });
        this.getRefreshToken();
      },
    );
  }

  getRefreshToken

  renderErrors() {
    if(!this.state.errors) {
      return null;
    }
    return (
      <View style={errorsStyle}>
        <Text>
          { this.state.errors }
        </Text>
        <Text>
          { this.state.errorStack }
        </Text>
      </View>
    );
  }

  render() {
    if(!this.state.loggedIn) {
      return (
        <SplashScreen />
      );
    }
    return (
      <Provider store={store}>
        <View style={ blackBack }>
          <StatusBar
            barStyle="light-content"
          />
          <ReportingApp
            store={store}
            renderErrors={this.renderErrors}
          />
        </View>
      </Provider>
    );
  }
}

export default App;
