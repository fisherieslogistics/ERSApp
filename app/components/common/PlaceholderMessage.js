"use strict";
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import { textStyles } from '../../styles/styles';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
  }
})

export default class PlaceHolderMessage extends Component {

  render() {
    const tStyle = { marginTop: this.props.height * 0.35, opacity: 0.65 };
    const bStyle = { backgroundColor: 'transparent' };
    return (
      <View style={[ styles.wrapper, bStyle ]}>
        <Text style={[ textStyles.largeLabel, textStyles.dark, tStyle ]}>
          { this.props.text }
        </Text>
      </View>
    );
  }

}
