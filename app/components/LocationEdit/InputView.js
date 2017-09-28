'use strict';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import { inputStyles, colors } from '../../styles/styles';
import {
  getDegreesMinutesFromLocation,
} from '../../utils/Helper';
import FocusOnDemandTextInput from '../common/FocusOnDemandTextInput';

const styles = StyleSheet.create({
  centerItems: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelWrapper: {
    flex: 0.3,
  },
  textInputWrapper: {
    flex: 0.7,
    borderBottomWidth: 0.5,
    marginLeft: 6,
    marginTop: 4,
  },
  wrapper: {
    flexDirection: 'row',
    height: 50,
  }
});

export default class InputView extends Component {

  constructor(props){
    super(props);
    const degMin = getDegreesMinutesFromLocation(this.props.location);
    this.state = {
      text: degMin[this.props.name].toString(),
    }
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentWillReceiveProps(props){
    const degMin = getDegreesMinutesFromLocation(props.location);
    const val = degMin[props.name];
    const renderedVal = isNaN(parseInt(val)) ? "" : val.toString();
    this.setState({
      text: renderedVal,
    });
  }

  onChangeText(text){
    this.props.onChange(this.props.coordType + this.props.label, parseInt(text));
  }

  onBlur() {}

  isValid(){
    const intVal = parseInt(this.state.text);
    if(isNaN(intVal)){
      return false;
    }
    if(intVal > this.props.maxVal){
      return false;
    }
    return true;
  }

  render(){
    const labelColor = this.isValid() ? colors.blue : colors.red;
    return (
      <View
        style={ styles.wrapper }
      >
        <View style={ [styles.labelWrapper, styles.centerItems] }>
          <Text style={[{ color: labelColor }]}>
            { this.props.label }
          </Text>
        </View>
        <View style={ [ styles.textInputWrapper, styles.centerItems ] }>
          <FocusOnDemandTextInput
            selectTextOnFocus
            keyboardType={ 'number-pad' }
            value={ this.state.text }
            style={ [ inputStyles.textInput ] }
            onChangeText={ this.onChangeText }
            onBlur={ this.onBlur }
            degMinType={ this.props.degMinType }
          />
        </View>
      </View>
    );
  }
}
