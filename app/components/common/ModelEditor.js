'use strict';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { modelEditorStyles, colors } from '../../styles/styles';
import AttributeEditor from './AttributeEditor';
import { getRenderableAttributes } from '../../utils/ModelUtils';
import { setFocusedInputId } from '../../actions/ViewActions';

const styles = StyleSheet.create(modelEditorStyles);
const wrapperStyle = [
  styles.col,
  styles.fill,
  styles.wrapper,
];

class ModelEditor extends React.Component {
  constructor(props) {
    super(props);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.renderInputWrapper = this.renderInputWrapper.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.setFocusedInputId = this.setFocusedInputId.bind(this);
    this.renderAttribute = this.renderAttribute.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.isFocused = this.isFocused.bind(this);
  }

  renderError(/*errorMessage, isFocused*/){
    return null;
    /*return (
      <ErrorBubble
        isFocused={ isFocused }
        errorMessage={ errorMessage }
      />
    );*/
  }

  renderLabel(attribute, active) {
    const tStyle = [styles.labelText];
    if(active) {
      tStyle.push({ color: colors.white, fontWeight: '600' });
    }
    const label = this.props.noLabelRow ? null : attribute.label;
    return (
      <View style={[ styles.row, styles.labelRow ]}>
        <Text style={ tStyle }>
          { label }
        </Text>
      </View>
    );
  }

  handleBlur() {
    this.props.dispatch(setFocusedInputId(null));
  }

  setFocusedInputId(inputId) {
    this.props.dispatch(setFocusedInputId(inputId));
  }

  isFocused(inputId) {
    return (inputId && this.props.focusedInputId === inputId);
  }

  getInputId(attribute) {
    return `${attribute.id}_input_${this.props.index}`;
  }

  getWrapperStyle(displayType) {
    if(displayType === 'combined' || displayType === 'child'){
     return styles.singleInput;
    }
    return styles.combinedInput;
  }

  getErrorMessage({ valid, combinedValid, id, type, fishingEvent }, extraProps) {
    const { modelValues } = this.props;
    return false;
    if (!valid.func(modelValues[id], modelValues, extraProps)) {
      return valid.errorMessage;
    }
    if(combinedValid && !combinedValid.func(combinedValid.attributes, modelValues, extraProps)){
      return combinedValid.errorMessage;
    }
  }

  renderInput(attribute, index, numInputs = 1) {

    const otherProps = this.props.getEditorProps(attribute, this.props.modelValues, index);

    const inputId = otherProps.inputId;

    const isFocused = this.isFocused(inputId);
    const value = this.props.modelValues[attribute.id];
    const errorMessage = this.getErrorMessage(attribute, otherProps);
    let errorView = errorMessage ? this.renderError(errorMessage, isFocused || otherProps.alwaysShowError) : null;
    const labelView = this.renderLabel(attribute, isFocused);

    const wrapperStyle = [
      { flex: 1 / numInputs },
      styles.col,
      this.getWrapperStyle(attribute.display.type),
    ];

    if(this.props.noLabelRow){
      errorView = null;
    }

    if(errorMessage || otherProps.error){
      wrapperStyle.push({
        borderBottomColor: colors.orange,
        borderBottomWidth: 1,
      });
    }

    const handlePress = () => {
      this.setFocusedInputId(inputId);
    };

    return (
      <TouchableOpacity
        key={ inputId }
        onPress={ handlePress }
        style= { wrapperStyle }
      >
        { errorView }
        { labelView }
        <AttributeEditor
          attribute={ attribute }
          handleBlur={ this.handleBlur }
          setFocusedInputId={ this.setFocusedInputId }
          inputId={ inputId }
          isFocused={ isFocused }
          onlyBlurChange={ true }
          index={ index }
          value={ value }
          onChange={ this.props.onChange }
          focusedInputId={ this.props.focusedInputId }
          { ...otherProps }
        />
      </TouchableOpacity>
    );
  }
  //Single Editor
  renderInputWrapper(attribute, inputs, index){
    const inputRowId = `${attribute.id}_${attribute.type}_input_view_${index}`;
    return (
      <View
        style={ this.props.wrapperStyle }
        key={ inputRowId }
      >
        <View style={[styles.row, styles.inputRow]}>
            { inputs }
        </View>
      </View>
    );
  }

  renderAttribute(attribute, index) {
    switch (attribute.display.type) {

      case "single": {
        const input = this.renderInput(attribute, index);
        return this.renderInputWrapper(attribute, [input], index);
      }
      case "combined": {
        const siblings = attribute.display.siblings.map(
          id => this.props.model.find(attr => attr.id === id));

        const numInputs = siblings.length + 1;
        const inputs = [attribute, ...siblings].map(
          (attr) => attr ? this.renderInput(attr, index, numInputs) : null);

        return this.renderInputWrapper(attribute, inputs, index);
      }
    }
  }

  renderInputs(){
    const attributes = getRenderableAttributes(this.props.model);
    const inputs = attributes.map(this.renderAttribute);
    return <View>{ inputs }</View>;
  }

  render() {
    if(!this.props.modelValues){
      return (<View />);
    }
    const inputs = this.renderInputs();
    return (
      <View style={ wrapperStyle }>
        <View style={ styles.innerWrapper }>
          { inputs }
        </View>
      </View>
    );
  }
}

const select = (state) => ({
  tripUpdated: state.trip.lastUpdated,
  fishingEventUpdated: state.fishingEvents.lastUpdated,
  focusedInputId: state.view.focusedInputId,
  lastUpdated: state.view.lastUpdated,
});

export default connect(select)(ModelEditor);
