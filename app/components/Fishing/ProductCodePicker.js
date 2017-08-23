
import { connect } from 'react-redux';
import { SuggestPickerClass } from '../common/SuggestPicker';
import { setSuggestChoices } from '../../actions/ViewActions';

function compare(i1, i2) {
  return (i1 + 1) - (i2 + 1);
}

class ProductCodePicker extends SuggestPickerClass {

  filterChoices({ favourites, fishingEvent }, choices) {
    const usedCodes = fishingEvent.estimatedCatch.map(p => p.code);
    const faves = [...favourites];
    const filteredChoices = choices.filter(c => !usedCodes.includes(c.value) || c.value === this.props.value);
    return filteredChoices.sort((c1, c2) => compare(faves.indexOf(c2.value), faves.indexOf(c1.value)));
  }

  componentWillUpdate(nextProps) {
    if (nextProps !== this.props) {
      if(this.props.fishingEvent.estimatedCatchValid !== nextProps.fishingEvent.estimatedCatchValid) {
        this.setSuggestChoices(nextProps);
      }
    }
  }

  setSuggestChoices() {
    const nextChoices = this.filterChoices(this.props, this.props.choices);
    this.props.dispatch(setSuggestChoices(nextChoices));
  }

}

const select = (state) => ({
    lastUpdated: state.fishingEvents.lastUpdated,
    favourites: state.view.suggestFavourites.estimatedCatch,
    suggestBarValue: state.view.suggestBarValue,
    suggestBarInputId: state.view.suggestBarInputId,
    suggestBarSearchTerm: state.view.suggestBarSearchTerm,
    focusedInputId: state.view.focusedInputId,
});

export default connect(select)(ProductCodePicker);
