'use strict';
import {
} from 'react-native';
import React, { Component } from 'react';
import { inputStyles } from '../../styles/styles';
import FocusOnDemandTextInput from './FocusOnDemandTextInput';

class EditOnBlurInput extends Component {

  constructor(props){
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.state = {
      value: props.value,
      renderedValue: this.getRenderedValue(props.value),
    }
    this.getKeypad = this.getKeypad.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.inputId !== this.props.inputId){
      this.setState({
        value: nextProps.value,
        renderedValue: this.getRenderedValue(nextProps.value)
      });
    }
  }

  onChangeText(text) {
    this.setState({
      value: text,
      renderedValue: text
    });
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter'){
      this.onBlur();
    }
  }

  onBlur(e){
    if(!e) {
      return;
    }
    this.props.onChange(this.getCorrectedValue(this.state.value));
    this.props.handleBlur(this.props.inputId);
    this.setState({
      renderedValue: this.getRenderedValue(this.state.value),
    });
  }

  getKeypad(){
    switch (this.props.attribute.type) {
      case "number":
        return 'number-pad'
      case "float":
        return 'numeric'
      default:
        return 'default'
    }
  }

  getCorrectedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        const num = parseInt(value);
        if(isNaN(num)){
          return this.props.attribute.unit ? "0" : "";
        }
        return num.toFixed(0);
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString();
      default:
        return value ? value.toString() : "";
    }
  }

  getRenderedValue(value){
    const unit = this.props.attribute.unit || "";
    return `${this.getCorrectedValue(value)} ${unit}`;
  }

  render(){
    /* eslint-disable react/jsx-handler-names */
    const editable = true;//!!this.props.editable;
    const keypadType = this.getKeypad();
    return (
      <FocusOnDemandTextInput
        selectTextOnFocus
        autoCorrect={ false }
        autoCapitalize={ 'none' }
        keyboardType={ keypadType }
        placeholderText={ this.props.attribute.label }
        value={ this.state.renderedValue }
        style={ inputStyles.textInput }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onChangeText={ this.onChangeText }
        isFocused={ this.props.isFocused }
        onKeyPress={ this.onKeyPress }
        editable={ editable }
        persistKeyboard={ !!this.props.persistKeyboard }
     />
    );
  }
}

export default EditOnBlurInput;
