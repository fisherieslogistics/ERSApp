/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 String.prototype.capitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1);
 }
import {
  AppRegistry,
} from 'react-native';

import App from './app/containers/App';

AppRegistry.registerComponent('FLLReporting', () => App);

export default App;
