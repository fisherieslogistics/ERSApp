'use strict';
import {
  View,
  Text,
} from 'react-native';
import React from 'react';
import { ProtectedSpongeModel, ProtectedOtherModel } from '../../models/ProtectedModel';
import { colors, modelEditorStyles } from '../../styles/styles';
import { LongButton } from '../common/Buttons';
import seabirdCodes from '../../constants/species/seabirdCodes';
import mammalCodes from '../../constants/species/mammalCodes';
import reptileCodes from '../../constants/species/reptileCodes';
import fishCodes from '../../constants/species/fishCodes';
import spongeCodes from '../../constants/species/spongeCodes';
import CatchesEditor from './common/CatchesEditor';

const typeButtonsWrapperStyle = [
  modelEditorStyles.innerWrapper,
  modelEditorStyles.row,
  modelEditorStyles.inputRow,
  { borderBottomColor: colors.orange },
];

const protectedSpeciesCodes = {
  'Seabird': seabirdCodes,
  'Mammal': mammalCodes,
  'Fish': fishCodes,
  'Reptile': reptileCodes,
  'Sponge': spongeCodes,
}

const buttonWrapper = { width: 80, marginRight: 5, height: 50 };
const types = ['Seabird', 'Mammal', 'Reptile', 'Fish', 'Sponge'];

class EventProtectedsEditor extends CatchesEditor {

  constructor(props){
    super(props);
    this.eventAttribute = 'protecteds';
    this.renderTypeButtons = this.renderTypeButtons.bind(this);
  }

  chooseType(item, type, index) {
    this.props.changeItem(
      this.eventAttribute, 'type', type, index);
  }

  getEditorProps(attribute, item, index) {
    const inputId = `${attribute.id}__edit_protected_${index}_${this.props.fishingEvent.RAId}_${item.RAId}`;
    const extraProps = {};
    const choices = protectedSpeciesCodes[item.type];
    const props = {
      attribute,
      extraProps,
      index,
      inputId,
      choices,
    };
    if(attribute.id === 'code') {
      props.extraProps.choices = choices;
      props.extraProps.autoCapitalize = 'characters';
    }
    return props;
  }

  renderTypeButtons(item, index) {
    const typeButtons = types.map((label) => {
      const chooseType = () => this.props.changeItem(this.eventAttribute, 'type', label, item, index);
      return (
        <View style={ buttonWrapper } key={`type-${label}`}>
          <LongButton
            text={ label }
            onPress={ chooseType }
            bgColor={ colors.white }
          />
        </View>
      );
    });
    return (
      <View key={`protecteds_editor_${index}`}>
        <View style={ [modelEditorStyles.col, modelEditorStyles.fill, modelEditorStyles.wrapper] }>
          <Text style={ modelEditorStyles.labelText }>Choose a protected type</Text>
          <View style={ typeButtonsWrapperStyle }>
            { typeButtons }
          </View>
        </View>
        { this.renderDeleteButton(item) }
      </View>
    );
  }

  renderEditors(){
    return this.props.items.map((p, i) => {
      if(!p.type) {
        return this.renderTypeButtons(p, i);
      }
      const model = p.type.toLowerCase() === 'sponge' ? ProtectedSpongeModel : ProtectedOtherModel;
      return this.renderEditor(p, i, model);
    });
  }

}

export default EventProtectedsEditor;
