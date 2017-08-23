"use strict";
import Button from './Button';
import React, { Component } from 'react';
import Icon8 from '../Icon8';

export default class IconButton extends Component {
  render() {
    const { icon, onPress, style, disabled, color } = this.props;
    const content = (
      <Icon8
        name={icon}
        size={30}
        color={color || 'red'}
        style={style}
      />
    );
    return (
      <Button
        disabled={disabled}
        onPress={onPress}
        content={content}
      />
    );
  }
}
