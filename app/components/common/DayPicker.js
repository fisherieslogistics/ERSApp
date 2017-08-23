
import { connect } from 'react-redux';
import { SuggestPickerClass } from '../common/SuggestPicker';
import { setSuggestSearchTerm, toggleSuggestBar, setFocusedInputId } from '../../actions/ViewActions';

class DayPicker extends SuggestPickerClass {

  onFocus() {
    this.props.dispatch(setFocusedInputId(this.props.inputId));
    this.props.dispatch(toggleSuggestBar(true, this.props.inputId));
    this.setSuggestChoices(this.props);
    this.props.dispatch(setSuggestSearchTerm(this.state.value));
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

export default connect(select)(DayPicker);
