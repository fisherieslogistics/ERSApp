import {
  View,
} from 'react-native';
import React from 'react';
import ModelEditor from '../common/ModelEditor';
import OtherSpeciesWeightModel from '../../models/OtherSpeciesWeightModel';
import ProcuctModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import CatchesEditor from './common/CatchesEditor';
import speciesDesc from '../../constants/species/speciesDesc';
import statesDesc from '../../constants/species/statesDesc';
import { updateFishingEvent } from '../../actions/FishingEventActions';

export default class EventProductsEditor extends CatchesEditor {

  constructor(props) {
    super(props);
    this.eventAttribute = 'estimatedCatch';
  }

  renderEditors = () => {
    const inputs = [];
    const num = 10 - this.props.items.length;
    this.props.items.forEach((p, i) => {
      inputs.push(this.renderEditor(p, i));
    });
    for(var i = 0; i < num; i++) {
      const blankFish = blankModel(ProcuctModel);
      blankFish._id = `blankFish_${i}`;
      blankFish._isblank = true;
      inputs.push(this.renderEditor(blankFish, i + this.props.items.length));
    }
    return inputs;
  }

  getExtraProps(item, attribute, index) {
     return {
      autoCapitalize: "characters",
      maxLength: 3,
      error: this.itemHasError(item),
      inputId: `${attribute.id}_${item._id}_${index}`,
    };
  }

  getSuggestions(id, code) {
    if (id === 'state') {
      const stateCodes = statesDesc.filter((state) => {
        if (state.species.length === 0) return true;
        if (state.species.indexOf(code) > -1) return true;
        return false;
      });
      return stateCodes;
    }
    return this.props.species.map(s => ({ value: s.code, description: s.fullName }));
  }

  getEditorProps = (attribute, item, index) => {
    const inputId = `${attribute.id}_${item._id}_${index}`;
    const props = {
      attribute,
      inputId,
      fishingEvent: this.props.fishingEvent,
    };

    switch (attribute.id) {
      case 'code':
      case 'state':
        props.extraProps = this.getExtraProps(item, attribute, index);
        break;
      case 'weightKgs':
        props.extraProps = { persistKeyboard: true };
        if(!item.code) {
          props.extraProps.nullInput = true;
        }
        break;
      default:
    }
    return props;
  }

  itemHasError(item) {
    return this.props.items.map(pt => pt.code).indexOf(item.code) !== -1;
  }

}
