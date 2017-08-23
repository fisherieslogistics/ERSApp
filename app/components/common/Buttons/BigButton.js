"use strict";
import{
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, { Component } from 'react';
import { styles } from './Button';

export default class BigButton extends Component {
  render() {
    const { onPress, backgroundColor, text, textColor, style } = this.props;
    const textStyle = [
      {color: textColor},
      styles.bigButtonText,
    ];
    const buttonStyle = [styles.bigButton, { backgroundColor }]
    return (
      <TouchableOpacity onPress={onPress} style={[buttonStyle, style]}>
         <View style={ styles.bigButtonInner }>
          <Text style={ textStyle }>
            { text }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
