'use strict';
import{
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { colors, textStyles } from '../../styles/styles';
import { setSuggestBarValue } from '../../actions/ViewActions';

const MAX_Suggest_RESULTS = 12;

const styles = {
  row:{
    flexDirection: 'row',
    flex: 1,
  },
  resultsBarWrapper: {
    position: 'absolute',
    bottom: 0,
    height: 80,
  },
  resultsBar: {
    height: 80,
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderTopWidth: 1,
    backgroundColor: colors.white,
    borderTopColor: colors.lightestGray,
    padding: 8,
  },
  resultText: {
    color: '#000',
    fontSize: 15,
  },
  resultTextValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  resultTextSelected: {
    color: '#000',
  },
  resultBackgroundSelected: {
    backgroundColor: colors.green,
  },
  resultBackground: {
    backgroundColor: colors.green,
  },
  result: {
    height: 62,
    padding: 4,
    marginRight: 4,
    borderRadius: 8,
    borderColor: colors.green,
  },
};

const test = (term, value) => `${term}`.toLowerCase() === `${value}`.substring(0, term.length).toLowerCase();

class SuggestBar extends Component {

  constructor(props){
    super(props);
    this.__searchTimeout = null;
    this.renderResult = this.renderResult.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.onResultPress = this.onResultPress.bind(this);
    this.searchChoices = this.searchChoices.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.state = {
      results: [],
    };
  }

  getSearchResults(term = '') {
    if(!this.props || !this.props.choices) {
      return [];
    }
    if(!term) {
      return this.props.choices.slice(0, MAX_Suggest_RESULTS);
    }
    const results = [];
    for(let i = 0; (i < this.props.choices.length) && (results.length < MAX_Suggest_RESULTS); i++){
      const choice = this.props.choices[i];
      if(test(term, choice.value)){
        results.push(choice);
      }
    }
    return results;
  }

  searchChoices(text) {
    const results = this.getSearchResults(text);
    this.setState({
      results,
    });
  }

  onChangeText(text) {
    clearTimeout(this.__searchTimeout);
    this.searchChoices(text);
  }

  componentWillReceiveProps(props) {
    this.onChangeText(props.searchTerm);
  }

  onResultPress(value) {
    this.props.dispatch(setSuggestBarValue(value));
  }

  renderResult(resultValue = '', description = '', i){
    const text = this.props.text || '';
    const isSelected = (resultValue.toString().toUpperCase() === text.toUpperCase()) || (this.state.results === 1);
    const resultTextStyle = isSelected ? styles.resultTextSelected : styles.resultText;
    let backgroundStyle = isSelected ? styles.resultBackgroundSelected : styles.resultBackground;
    if(description.length > 20) {
      backgroundStyle = Object.assign({}, backgroundStyle, { width: 140 });
    }
    const onPress = () => this.onResultPress(resultValue);
    return (
      <TouchableOpacity key={`${i  }_Suggest_${  resultValue}`}
        onPress={onPress}
        style={[styles.result, backgroundStyle]}
      >
        <Text style={[textStyles.font,resultTextStyle, styles.resultTextValue]}>
          { resultValue }
        </Text>
        <Text style={[textStyles.font, resultTextStyle]}>
          { description }
        </Text>
      </TouchableOpacity>
    );
  }

  renderResults(){
    const { searchTerm } = this.props;
    const results = searchTerm ? this.state.results : this.getSearchResults();
    return results.map(
      ({ value, description }, i) => this.renderResult(value, description || '', i));
  }

  render () {
    if(!this.props.visible){
      return null;
    }
    let keyboardplace = 315;
    if(this.props.width === 1024){
      keyboardplace = 400;
    }
    const wrap = [styles.resultsBarWrapper, { bottom: keyboardplace }];
    const inner = [styles.resultsBar, { width: this.props.width } ];
    return (
      <View style={wrap}>
        <View style={inner}>
          { this.renderResults() }
        </View>
      </View>
    );
  }
}

const select = (state) => {
  const {
    suggestBarVisible,
    suggestBarChoices,
    suggestBarSearchTerm,
    suggestBarInputId,
    suggestBarValue,
  } = state.view;
  return {
    visible: suggestBarVisible,
    choices: suggestBarChoices,
    searchTerm: suggestBarSearchTerm,
    inputId: suggestBarInputId,
    selectedValue: suggestBarValue,
  };
};

export default connect(select)(SuggestBar);
