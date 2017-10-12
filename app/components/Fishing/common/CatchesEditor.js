'use strict';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, modelEditorStyles } from '../../../styles/styles';
import ModelEditor from '../../common/ModelEditor';
import speciesDesc from '../../../constants/species/speciesDesc';
import Icon8 from '../../common/Icon8';
const styles = StyleSheet.create(Object.assign({}, modelEditorStyles));

const toBind = [
  'renderDeleteButton',
  'getEditorProps',
  'renderEditors',
  'itemHasError',
];

const deleteWrap = {
  position: 'absolute',
  right: 0,
  top: 2,
};

class CatchesEditor extends Component{
  constructor (props) {
    super(props);
    toBind.forEach((mName) => {
      this[mName] = this[mName].bind(this);
    });
  }

  getEditorProps(attribute, item, index) {
    const inputId = `${attribute.id}_${item.RAId}`;
    return {
      attribute,
      index,
      inputId,
    };
  }

  itemHasError(item) {
    return !item;
  }

  getSuggestions(){
    return speciesDesc;
  }

  renderEditor(item, index, model) {
    const onChange = (inputId, value) => this.props.changeItem(
      this.eventAttribute, inputId, value, item, index);

    const deleteButton = this.renderDeleteButton(item)
    const modelToUse = model || this.props.model;
    return (
      <View
        key={`item_editor_${index}_${item.code}_${item.RAId}_${this.props.fishingEvent.RAId}`}
      >
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ modelToUse }
          index={ index }
          noLabelRow={ (index > 0) }
          modelValues={ item }
          values={ this.props.fishingEvent }
          onChange={ onChange }
          dispatch={ this.props.dispatch }
        />
        { deleteButton }
      </View>
    )
  }

  renderDeleteButton(item){
    const deleteItem = () => this.props.deleteItem(this.eventAttribute, item);
    const delStyle = [styles.deleteButtonWrapper];
    return (
      <View style={deleteWrap}>
        <TouchableOpacity
          onPress={ deleteItem }
          style={ delStyle }
        >
          <Icon8
            name={ 'delete' }
            size={ 18 }
            color={ colors.red }
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderEditors(){
    const inputs = [];
    this.props.items.forEach((p, i) => {
      inputs.push(this.renderEditor(p, i));
    });
    return inputs;
  }

  render() {
    const spacer = { height: 30 };
    const itemEditors = this.renderEditors();
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 500 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
        keyboardShouldPersistTaps={ 'always' }
      >
        <View
          style={ spacer }
        />
        { itemEditors }
      </KeyboardAwareScrollView>
    );
  }
}

export default CatchesEditor;
