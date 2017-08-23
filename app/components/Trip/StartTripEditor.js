'use strict';
import {
  View,
} from 'react-native';
import React, { Component } from 'react';
import moment from 'moment';
import TripModel from '../../models/TripModel';
import ModelEditor from '../common/ModelEditor';
import ports from '../../constants/ports';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updateTrip } from '../../actions/TripActions';

class StartTripEditor extends Component {

  constructor(props){
    super(props);
    this.getEditorProps = this.getEditorProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getExtraProps = this.getExtraProps.bind(this);
    this.state = {};
  }

  onChange(name, value){
    const { trip } = this.props;
    const changes = {};
    if(name === 'RAEnd_date') {
      const RAStart_date = new Date();
      const RAEnd_date = moment(RAStart_date).clone().add(parseInt(value) || 0, "days");
      changes[name] = RAEnd_date.toDate();
      changes.RAStart_date = RAStart_date;
    } else {
      changes[name] = value;
    }
    this.props.dispatch(updateTrip(changes, trip));
  }

  getDayChoices(RAStart_date) {
    const choices = [...Array(50).keys()].map((num, i) => {
      const date = moment(RAStart_date).clone().add(i, "days");
      return {
        value: i,
        description: date.format("MMM Do YY"),
      };
    });
    return choices;
  }

  getEditorProps(attribute) {
    const extraProps = this.getExtraProps(attribute);
    const value = this.props.trip[attribute.id] || '';
    const inputId = `${attribute.id}__tripstart__`;
    return {
      attribute,
      value,
      inputId,
      onChange: this.onChange,
      extraProps,
    };
  }

  getExtraProps(attribute){
    const extraProps = {
      inputId: `${attribute.id}__tripstart__`,
      value: this.props.trip[attribute.id] || "",
    };
    switch (attribute.id) {
      case "leavingPort":
      case "endPort":
        extraProps.view = 'ports';
        extraProps.choices = ports;
      break;
      case "RAStart_date":
        extraProps.mode = "date";
        extraProps.format = "Do MM YYYY";
      break;
      case "RAEnd_date":
        const { RAEnd_date, RAStart_date } = this.props.trip;
        const startDate = moment(RAStart_date || new Date());
        const endDate = moment(RAEnd_date || new Date());
        extraProps.sortResultsBy = (a, b) => parseInt(a.value) - parseInt(b.value);
        extraProps.choices = this.getDayChoices(startDate.clone());
        const days = moment.duration(endDate.diff(startDate)).asDays();
        extraProps.value = days.toFixed(0).toString();
        extraProps.maxResults = 15;
      break;
    }
    return extraProps;
  }

  render() {

    const styleGap = {
      marginTop: 20,
      flex: 1,
    }

    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 150 }
        bouncesZoom={false}
        alwaysBounceVertical={false}
      >
        <View style={styleGap}>
          <ModelEditor
            getEditorProps={ this.getEditorProps }
            model={ TripModel }
            modelValues={ this.props.trip }
            index={ 1 }
            onChange={ this.onChange }
            dispatch={ this.props.dispatch }
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default StartTripEditor;
