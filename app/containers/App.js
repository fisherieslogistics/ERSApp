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
import jwtDecode from 'jwt-decode';
import request from 'superagent';
import ReportingApp from './ReportingApp';
import SplashScreen from '../components/SplashScreen';
import ConnectionMiddleware from '../reducers/middlewares/ConnectionMiddleware';

import PouchMiddleware, { initialize } from '../reducers/middlewares/PouchMiddleware';

import AddUsefulToActions from '../reducers/middlewares/AddUsefulToActions';
import { startConnection } from '../actions/ConnectionActions';
import { updateUser } from '../actions/UserActions';
import iOSLocation from '../api/location/iOSLocation';
import { getPorts, getSpecies, getVessels } from '../api/RestApi';
import { updatePorts } from '../actions/PortActions';
import { updateSpecies } from '../actions/SpeciesActions';
import { updateVessels } from '../actions/VesselActions';

//import ErrorUtils from 'ErrorUtils';
import { reducers } from '../reducers/main';
import serverURL from '../constants/ServerURL';

const createStoreWithMiddleware = applyMiddleware(thunk, AddUsefulToActions, ConnectionMiddleware)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
const blackBack = { backgroundColor: 'black' };
const errorsStyle = { backgroundColor: 'red', height: 90, width: 768, paddingTop: 20 };

const LOGIN_URI = serverURL + 'api-token-auth/';
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
    this.getRefreshToken = this.getRefreshToken.bind(this);
    this.iosLocation = new iOSLocation();
  }

  componentDidMount() {
    this.login();
  }

  onLoggedIn(token, username) {
    AsyncStorage.setItem('refreshToken', token, () => {
      Promise.all([getPorts(token), getSpecies(token), getVessels(token)]).then((values) => {

        const ports = values[0];
        const species = values[1];
        const vessels = values[2];
        const user = jwtDecode(token);
        store.dispatch({ type: 'setPorts', payload: { changes: ports.map(
          p => ({ value: p.name, description: ''})) }});
        store.dispatch({ type: 'setSpecies', payload: { changes: species.map(
          p => ({ value: p.code, description: p.description})) }});
        store.dispatch({ type: 'setVessels', payload: { changes: vessels }});
        store.dispatch({ type: 'setUser', payload: { changes: user }});
        store.dispatch(initialize(token));
        store.dispatch(startConnection());
        this.setState({
          loggedIn: true,
        });
      }).catch(err => {
        console.log(err);
        AsyncStorage.removeItem('refreshToken', () => {
          this.setState({
            loggedIn: false,
          });
          this.login();
        });
      });
    });
  }

  login(msg=null) {
    AsyncStorage.getItem('refreshToken', (err, refreshToken) => {
      if(!refreshToken) {
        this.promptUsername(msg);
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
        if(err) {
          console.warn('errr', err);
          this.login(err.message);
        }
        if(res && res.body && res.body.token) {
          this.onLoggedIn(res.body.token);
        }
      });
  }

  promptUsername(msg=null) {
    AlertIOS.prompt('Enter Username', msg, [
      { text: 'No', style: 'destructive',
        onPress: () => this.promptUsername('you gotta do it')},
      { text: 'Next', style: 'default', onPress: (username) => {
        this.setState({ username });
        this.promptPassword();
      }},
    ]);
  }

  promptPassword() {
    AlertIOS.prompt('Enter Password', null, [
      { text: 'Back', style: 'destructive',
        onPress: () => this.promptUsername('did you forget it?')},
      { text: 'Login', style: 'default', onPress:(password) => {
        this.setState({ password });
        this.getRefreshToken();
      }},
    ]);
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
