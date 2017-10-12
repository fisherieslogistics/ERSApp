'use strict';
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import FORM_TYPE from '../../../constants/MPIFormType';
import HaulButton from './HaulButton';
const style = {
  buttonWrapper: {
    flex: 1,
    height: 100,
    alignSelf: 'stretch',
  }
}

export default class BottomMasterButton extends Component {

  render() {
    switch (FORM_TYPE) {
      case 'TrawlEvent':
      case 'HandGatheringEvent':
        return null;
      case 'LCER':
        return (
          <View style={style.buttonWrapper}>
            <HaulButton />
          </View>
        );
    }
  }

}
