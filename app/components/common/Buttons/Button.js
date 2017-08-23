"use strict";
import{
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import { textStyles, colors } from '../../../styles/styles';

export const styles = StyleSheet.create({
  longButton: {
    borderWidth: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigButtonText: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
  BigButtonInner: {
    alignItems: 'center',
  },
  bigButton: {
    alignSelf: 'stretch', flex: 1,
  }
});

export const getActiveOpacity = (disabled) => disabled ? 1 : 0.6

export const getTextStyle = (color, disabled) =>[
    textStyles.font,
    textStyles.button,
    {color: ! disabled ? color : colors.midGray},
];

export default class Button extends Component {
  render() {
    const { onPress, content, disabled } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={ getActiveOpacity(disabled) }
        onPress={ disabled ? null : onPress }>
          { content }
      </TouchableOpacity>
    );
  }
}
