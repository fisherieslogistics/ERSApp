'use strict';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React,  { Component } from 'react';
import { colors } from '../../styles/styles';
import Icon8 from './Icon8';

const styles = StyleSheet.create({
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    borderRadius: 5,
    borderColor: colors.blue,
    margin: 6,
  },
  radioButtonIcon: {
    alignSelf: 'flex-end',
    flex: 0.3,
  },
  radioButtonText: {
    fontSize: 18,
    color: colors.green,
    alignSelf: 'flex-start',
    flex: 0.7,
  },
  selectedText: {
    fontWeight: '700',
    borderWidth: 2,
  },
  text: {
    fontWeight: '100',
    borderWidth: 1,
  },
});

export default class FLRadioButton extends Component {

  renderIcon() {
    if(this.props.selected) {
      return null;
    }
    return (
      <Icon8
        name={'ok'}
        size={ 20 }
        color={ 'green' }
        style={ styles.radioButtonIcon }
      />
    );
  }

  render() {
    const { text, selected, onSelect, index } = this.props;
    const icon = this.renderIcon();
     const textStyle = selected ? styles.selectedText : styles.text;
    return (
      <TouchableOpacity
        onPress={ onSelect }
        key={ `${index}_${text}` }
        style={ styles.radioButton }
      >
        <Text
          style={[ styles.radioButtonText, textStyle ]}
        >
          { text }
        </Text>
          { icon }
      </TouchableOpacity>
    );
  }

}
