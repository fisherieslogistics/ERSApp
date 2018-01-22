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

  renderLabel({ label, valid }, active, is_valid) {
    if(is_valid) {
      return (<Text style={styles.labelError}>{ `${label}  *${valid.errorMessage}` }</Text>);
    } else {
      const tStyle = active ? styles.activeText : styles.labelText;
      return (<Text style={[tStyle]}>{ label }</Text>);
    }
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

  renderInput(attribute, index, numInputs = 1) {

    const { valid, label, display } = attribute;
    const { modelValues, fishCatches } = this.props;
    const value = this.props.modelValues[attribute.id];
    const is_valid = valid && !valid.func(value, modelValues, fishCatches);
    const otherProps = this.props.getEditorProps(attribute, this.props.modelValues, index);
    const { inputId } = otherProps;

    const isFocused = this.isFocused(inputId);
    const labelText = !this.props.noLabelRow && this.renderLabel(attribute, isFocused, is_valid);

    const handlePress = () => {
      this.setFocusedInputId(inputId);
    };

    return (
      <TouchableOpacity
        key={ inputId }
        onPress={ handlePress }
        style= { [ styles.col, styles.singleInput] }
      >
        <View style={[ styles.row, styles.labelRow ]}>
          { labelText }
        </View>
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
  fishCatches: state.fishingEvents.viewingFishCatches,
});

export default connect(select)(ModelEditor);
