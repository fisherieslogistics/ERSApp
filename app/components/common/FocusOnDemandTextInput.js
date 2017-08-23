'use strict';
import {
  TextInput,
  Keyboard,
} from 'react-native';

export default class FocusOnDemandTextInput extends TextInput {

  constructor(props) {
    super(props);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentWillMount () {
    if (this.listening !== true) {
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    this.listening = true;
  }

  componentWillUnmount () {
    clearTimeout(this.timeout);
    this.keyboardDidHideListener.remove();
    if(this.props.isFocused && this.isFocused()) {
      this.blur();
    }
  }

  _keyboardDidHide () {
    if(this.props.isFocused && this.isFocused()) {
      clearTimeout(this.timeout);
      this.blur();
    }
  }

  componentWillReceiveProps(nextProps) {
    if((!this.props.isFocused && nextProps.isFocused) &! this.isFocused()) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.focus());
      return;
    }
    if(this.props.persistKeyboard) {
      return;
    }
    if((this.props.isFocused && !nextProps.isFocused) && this.isFocused()) {
      clearTimeout(this.timeout);
      this.blur()
      //this.timeout = setTimeout(() => this.blur());
      return;
    }
  }

}
