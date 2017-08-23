'use strict';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import { colors } from '../../styles/styles';
const styles = StyleSheet.create({
  inputWrapper: {
    flex: 0.85,
  },
  formControls: {
    flex: 0.15,
  },
  formControlsInner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topSection: {
    flex: 0.5,
    flexDirection: 'row',
  },
  bottomSection: {
    flex: 0.5,
  },
  wrapper: {
    backgroundColor: colors.black,
  },
  blurViewInner: {
    flex: 1,
    padding: 15,
    paddingLeft: 60,
    paddingRight: 60,
  },
  formWrapper: {
    alignItems: 'stretch',
    flex: 1,
  },
});


export default class FormContainer extends Component {

  render() {
    const { height, width } = Dimensions.get('window');
    const size = { width, height };
    return (
      <View style={ [size, styles.wrapper] }>

        <View style={ styles.blurViewInner  }>

          <View style={ styles.formWrapper }>

            <View style={ styles.topSection }>
              <View style={ styles.inputWrapper } >
                { this.props.inputs }
              </View>
            </View>

            <View style={ styles.bottomSection } >
              <View style={ styles.formControls } >
                <View style={ styles.formControlsInner }>
                  { this.props.controls }
                </View>
              </View>
            </View>

          </View>

        </View>
      </View>
    );
  }
}
