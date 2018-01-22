"use strict";
import{
  View,
  Text,
} from 'react-native';
import React, { Component } from 'react';
import { textStyles, colors } from '../../../styles/styles';
import Button, { styles } from './Button';

export default class LongButton extends Component {

  render() {
    const { text, bgColor, onPress, disabled, active, error } = this.props;
    const backgroundColor = active ? bgColor : colors.transparent;
    const colorStyle = {
      backgroundColor,
      borderColor: bgColor,
    };
    let textColor = active ? colors.white : bgColor;
    if(disabled){
      textColor = colors.transparent;
    }
    const txtStyle = { color: textColor, fontSize: 21 };
    if(active){
      txtStyle.fontWeight = '600';
    }
    if(error){
      colorStyle.borderBottomColor = colors.orange;
      colorStyle.borderTopColor = colors.orange;
    }
    const content = (
      <View style={[ colorStyle, styles.longButton ]}>
        <Text style={[textStyles.font, txtStyle]}>
          { text }
        </Text>
      </View>
    );
    return (
      <Button
        disabled={ disabled }
        onPress={ onPress }
        content={ content }
      />
    );
  }

}
