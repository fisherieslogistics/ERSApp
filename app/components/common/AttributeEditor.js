'use strict';
import {
  Switch,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import { inputStyles } from '../../styles/styles';
import LocationEditor from '../LocationEdit/LocationEditor';
import SuggestPicker from './SuggestPicker';
import DayPicker from './DayPicker';
import ProductCodePicker from '../Fishing/ProductCodePicker';
import EditOnBlurInput from './EditOnBlurInput';
import JSONPointToLocation from '../../utils/JSONPointToLocation';
import Label from './Label';

const styles = {
  custom: {
    dateText: inputStyles.dateText,
    dateInput: inputStyles.dateInput,
    dateIcon: inputStyles.dateIcon,
  },
  style: {
    width: 200,
  },
  label: {
    width: 30,
  },
};

const datePickerFormat = 'HH:mm   DD - MMM';

class AttributeEditor extends Component {

  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.labelPress = this.labelPress.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.isFocused || (nextProps.value !== this.props.value) || (nextProps.isFocused !== this.props.isFocused)){
      return true;
    }
    return false;
  }

  onDateChange(dateAsString, datetime) {
    return this.props.onChange(this.props.attribute.id, datetime, dateAsString);
  }

  onChange(value) {
    let val = value;
    switch (this.props.attribute.type) {
      case 'number':
        val = parseInt(val);
        break;
      case 'float':
        val = parseFloat(value);
        break;
    }
    console.log(val, "on change")
    this.props.onChange(this.props.attribute.id, val);
  }

  labelPress() {
    this.props.setFocusedInputId(this.props.inputId);
  }

  renderLabel(height, marginTop) {
    const style = [{ height, marginTop }, this.props.styles];
    return (
      <TouchableOpacity
        style={ style }
        onPress={ this.labelPress }
        focusedInputId={ this.props.focusedInputId }
      >
          <Text style={ inputStyles.dateText }>
            {`${this.props.value}`}
          </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      attribute,
      value,
      index,
      onChange,
      extraProps,
      editingCallback,
      onEnterPress,
      inputId,
      isFocused,
      handleBlur,
      setFocusedInputId,
      focusedInputId,
      fishingEvent,
    } = this.props;

    switch (attribute.type) {
      case "datetime":

        //TODO make sure we only passing around dates or moments - not both
        let date = (value || new Date());
        if(value && value._isAMomentObject) {
          console.warn("PASSING A MOMENT");
          date = value.toDate();
        }
        
        if(typeof value === 'string'){
          date = new Date(value);
        }

        return (
          <DatePicker
            date={ date }
            mode="datetime"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={ styles.custom }
            style={ styles.style }
            onDateChange={ this.onDateChange }
            format={ datePickerFormat }
            { ...extraProps }
          />
        );
      case "productCodePicker":
        if(inputId !== focusedInputId) {
          return this.renderLabel(18, 8);
        }
        return (
          <ProductCodePicker
            onChange={ this.onChange }
            value={ value }
            attribute={ attribute.id }
            inputId={ inputId }
            index={ index }
            handleBlur={ handleBlur }
            isFocused={ isFocused }
            setFocusedInputId={ setFocusedInputId }
            { ...extraProps }
          />
        );
      case "picker":
        if(inputId !== focusedInputId) {
          return this.renderLabel(28, 4);
        }
        return (
          <SuggestPicker
            onChange={ this.onChange }
            value={ value }
            attribute={ attribute }
            inputId={ inputId }
            index={ index }
            handleBlur={ handleBlur }
            isFocused={ isFocused }
            setFocusedInputId={ setFocusedInputId }
            { ...extraProps }
          />
        );
      case 'day_picker':
        if(inputId !== focusedInputId) {
          return this.renderLabel(28, 4);
        }
        return (
          <DayPicker
            onChange={ this.onChange }
            value={ value }
            attribute={ attribute }
            inputId={ inputId }
            index={ index }
            handleBlur={ handleBlur }
            isFocused={ isFocused }
            setFocusedInputId={ setFocusedInputId }
            { ...extraProps }
          />
        );
      case "location":
        let loc;
        const locFields = [
          'locationAtEnd',
          'locationAtStart',
          'NetAtDepthLocation',
          'NetLeaveDepthLocation',
        ];
        
        if(locFields.includes(attribute.id)) {
          
          loc = JSONPointToLocation(fishingEvent[attribute.id]);
          
        }
        return (
          <LocationEditor
            attribute={ attribute }
            value={ loc || { lat: 0, lon: 0 } }
            onChange={ onChange }
            inputId={ inputId }
            editingCallback={editingCallback}
          />
        );
      case "bool":
        const boolVal = !!value
        return (
          <Switch
            onValueChange={ this.onChange }
            value={ boolVal }
            { ...extraProps }
          />
        );
      case "label":
        const wrap = { width: 70 };
        return (<Label value={value} style={wrap} />);
      case "number":
      case "float":
      default:
        return (
          <EditOnBlurInput
            key={`${attribute.id}-${inputId}-${value}`}
            handleBlur={ handleBlur }
            attribute={ attribute }
            value={ value }
            onChange={ this.onChange }
            inputId={ inputId }
            isFocused={ isFocused }
            onEnterPress={ onEnterPress }
            { ...extraProps }
          />
        );
    }
  }
}

export default AttributeEditor;
