"use strict";
import{
  View,
  Text,
} from 'react-native';
import React, { Component } from 'react';
import Button, { getTextStyle } from './Button';

export default class TextButton extends Component {
  render() {
    const { text, color, style, onPress, disabled } = this.props;
    const textStyle = getTextStyle(color, disabled);
    const content = (
      <View style={style}>
        <Text style={textStyle}>
          {text}
        </Text>
      </View>
    );
    return (
      <Button
        disabled={disabled}
        onPress={onPress}
        content={content}
      >
        { content }
      </Button>
    );
  }
}
