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


const deleteWrap = {
  position: 'absolute',
  right: 0,
  top: 2,
};

class CatchesEditor extends Component{

  getEditorProps(attribute, item, index) {
    const inputId = `${attribute.id}_${item.RAId}`;
    console.log(attribute.id);
    return {
      attribute,
      index,
      inputId,
    };
  }

  getSuggestions(){
    return speciesDesc;
  }

  renderEditors() {
    return [];
  }

  renderEditor(item, index, model) {
    const onChange = (inputId, value) => this.props.changeItem(
      this.eventAttribute, inputId, value, item, index);

    const modelToUse = model || this.props.model;
    return (
      <View
        key={`item_editor_${index}_${item.species_id}_${item.RAId}_${this.props.fishingEvent.RAId}`}
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
      </View>
    )
  }

  render() {
    const spacer = { height: 30 };
    const itemEditors = this.renderEditors();
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 140 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
        keyboardShouldPersistTaps={ 'always' }
        style={{ padding: 6 }}
      >
        <View
          style={ spacer }
        />
        <View>
          { itemEditors }
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default CatchesEditor;
