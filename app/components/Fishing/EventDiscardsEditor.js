import EventProductsEditor from './EventProductsEditor';
import speciesDesc from '../../constants/species/speciesDesc';


export default class EventDiscardsEditor extends EventProductsEditor {

  constructor(props) {
    super(props);
    this.eventAttribute = 'discards';
  }

  getSuggestions() {
    return speciesDesc;
  }

  getExtraProps(item) {
     return {
      choices: this.getSuggestions(),
      autoCapitalize: "characters",
      eventAttribute: 'discards',
      maxLength: 3,
      error: this.itemHasError(item),
      fishingEvent: { estimatedCatch: []},
    };
  }

  renderEditors(){
    const inputs = [];
    this.props.items.forEach((p, i) => {
      inputs.push(this.renderEditor(p, i));
    });
    return inputs;
  }

}
