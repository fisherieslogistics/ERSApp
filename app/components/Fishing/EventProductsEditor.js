import {
  View,
} from 'react-native';
import React from 'react';
import ModelEditor from '../common/ModelEditor';
import OtherSpeciesWeightModel from '../../models/OtherSpeciesWeightModel';
import CatchesEditor from './common/CatchesEditor';
import speciesDesc from '../../constants/species/speciesDesc';
import statesDesc from '../../constants/species/statesDesc';
import { updateFishingEvent } from '../../actions/FishingEventActions';

export default class EventProductsEditor extends CatchesEditor {

  constructor(props) {
    super(props);
    this.eventAttribute = 'estimatedCatch';
    this.onChangeOtherSpeciesWeight = this.onChangeOtherSpeciesWeight.bind(this);
  }

  renderEditors(){
    const inputs = [];
    this.props.items.forEach((p, i) => {
      inputs.push(this.renderEditor(p, i));
    });
    inputs.push(this.renderOtherSpeciesEditor());
    return inputs;
  }

  onChangeOtherSpeciesWeight(value) {
    const { fishingEvent } = this.props;
    this.props.dispatch(updateFishingEvent(fishingEvent, { 'otherSpeciesWeight': value }));
  }

  renderOtherSpeciesEditor() {
    return null
    /*const onChange = (name, value) => this.onChangeOtherSpeciesWeight(value);
    const inputId = `other_species_amount_editor_${ this.props.fishingEvent.RAId }`;
    const getEditorProps = () => ({
      inputId,
    });
    return (
      <View
        key={`${inputId}-containter`}
      >
        <ModelEditor
          getEditorProps={ getEditorProps }
          model={ OtherSpeciesWeightModel }
          modelValues={ this.props.fishingEvent }
          index={ this.props.fishingEvent.numberInTrip }
          onChange={ onChange }
        />
      </View>
    )*/
  }

  getExtraProps(item, attribute) {
     return {
      choices: this.getSuggestions(attribute.id, item.code),
      autoCapitalize: "characters",
      eventAttribute: 'estimatedCatch',
      maxLength: 3,
      error: this.itemHasError(item),
      fishingEvent: this.props.fishingEvent,
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

  getEditorProps(attribute, item, index) {
    const inputId = `${attribute.id}_${item.RAId}`;
    const props = {
      attribute,
      index,
      inputId,
      fishingEvent: this.props.fishingEvent,
    };

    switch (attribute.id) {
      case 'code':
      case 'state':
        props.extraProps = this.getExtraProps(item, attribute);
        break;
      case 'amount':
        props.extraProps = { persistKeyboard: true };
        break;
      default:
    }
    return props;
  }

  itemHasError(item) {
    return this.props.items.map(pt => pt.code).indexOf(item.code) !== -1;
  }

}
