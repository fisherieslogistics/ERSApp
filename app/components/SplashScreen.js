'use strict';
import React, {
  Component,
} from 'react';
import {
  View,
  Image,
  Dimensions,
} from 'react-native';

const blackBack = { backgroundColor: 'black' };

export default class SplashScreen extends Component {
  render() {
    const { width, height } = Dimensions.get('window');
    const backStyle = {
      height,
      width,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
    }
    if(width === 768) {
      return (
        <View style={ blackBack }>
          <Image
            source={require('../images/Splash.png')}
            style={backStyle}
          />
        </View>
      );
    }
    return (
      <View style={ blackBack }>
        <Image
          source={require('../images/SplashLandscape.png')}
          style={backStyle}
        />
      </View>
    );
  }
}
