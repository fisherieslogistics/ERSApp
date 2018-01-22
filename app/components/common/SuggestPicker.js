
import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import { inputStyles } from '../../styles/styles';
import FocusOnDemandPickerInput from './FocusOnDemandPickerInput';
import { setSuggestSearchTerm, setSuggestChoices, toggleSuggestBar, setFocusedInputId } from '../../actions/ViewActions';


class SuggestPickerClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value.toString() : "",
    }
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter'){
      this.onValueChange(this.state.value);
    }
  }

  componentWillReceiveProps(props) {
    if(props.suggestBarInputId !== this.props.inputId) {
      this.setState({
        value: props.value,
      });
      console.log("SET STATE", props.value, "setstate props *********************");
      return;
    }
    if(props.suggestBarValue) {
      this.onValueChange(props.suggestBarValue);
    }
  }

  setSuggestChoices() {
    this.props.dispatch(setSuggestChoices(this.props.choices));
  }

  onFocus() {
    this.props.dispatch(setFocusedInputId(this.props.inputId));
    this.props.dispatch(toggleSuggestBar(true, this.props.inputId));
    this.setSuggestChoices(this.props);
    this.props.dispatch(setSuggestSearchTerm(this.state.value));
  }

  onValueChange(value) {
    this.onBlur(null, value);
  }

  onBlur(evt, value) {
    this.props.handleBlur();
    this.onChangeText(value);
    if(value) {
      this.props.onChange(value);
    } else {
      this.props.onChange(this.state.value);
    }
    this.props.dispatch(toggleSuggestBar(false));
  }

  onChangeText(value) {
    const text = `${value}`
    this.setState({
      value: text,
    });
    this.props.dispatch(setSuggestSearchTerm(text));
  }

  render () {
    const style = [inputStyles.textInput, this.props.styles, { color: '#fff' }];
    return(
      <FocusOnDemandPickerInput
        style={ style }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onChangeText={ this.onChangeText }
        value={ `${this.state.value}` }
        selectTextOnFocus
        autoCapitalize={ 'characters' }
        autoCorrect={ false }
        editable={ !this.props.disabled }
        isFocused={ this.props.isFocused }
        onKeyPress={ this.onKeyPress }
        maxLength={ this.props.maxLength || 900 }
      />
    );
  }
}

export { SuggestPickerClass }

const select = (state) => ({
  suggestBarValue: state.view.suggestBarValue,
  suggestBarInputId: state.view.suggestBarInputId,
  favourites: state.view.suggestFavourites.speciesCode,
  suggestBarSearchTerm: state.view.suggestBarSearchTerm,
  lastUpdated: state.view.lastUpdated,
  focusedInputId: state.view.focusedInputId,
});

export default connect(select)(SuggestPickerClass);
