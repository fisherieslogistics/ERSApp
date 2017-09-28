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


class StartTripEditor extends Component {

  constructor(props){
    super(props);
    this.getEditorProps = this.getEditorProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getExtraProps = this.getExtraProps.bind(this);
    this.state = {};
  }

  onChange(name, value){
    const trip = this.props.trip;
    const changes = {};
    if(name === 'endTime' || name === 'ETA') {
      const startTime = new Date();
      const endTime = moment(startTime).clone().add(parseInt(value) || 0, "days");
      changes.endTime = endTime.toDate();
      changes.ETA = endTime.toDate();
      changes.startTime = startTime;
    } else {
      changes[name] = value;
    }
    changes._id = trip._id;
    changes._rev = trip._rev;
    this.props.db.update(changes, trip._id);
  }

  getDayChoices(startTime) {
    const choices = [...Array(50).keys()].map((num, i) => {
      const date = moment(startTime).clone().add(i, "days");
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
      case "unloadPort":
        extraProps.view = 'ports';
        extraProps.choices = this.props.ports;
      break;
      case "startTime":
        extraProps.mode = "date";
        extraProps.format = "Do MM YYYY";
      break;
      case "ETA":
        const { endTime, startTime, ETA } = this.props.trip;
        const startDate = moment(startTime || new Date());
        const endDate = moment(endTime || new Date());
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
    );
  }
}

export default StartTripEditor;
