'use strict';
import {
  View,
} from 'react-native';
import React, { Component } from 'react';
import moment from 'moment';
import TripModel from '../../models/TripModel';
import ModelEditor from '../common/ModelEditor';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


class StartTripEditor extends Component {

  constructor(props){
    super(props);
    this.getEditorProps = this.getEditorProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getExtraProps = this.getExtraProps.bind(this);
    this.state = {};
  }

  onChange = (name, value) => {
    const { trip, ports } = this.props;
    let changes = {};
    if(name === 'startTime' || name === 'ETA') {
      const datetimeAtStart = new Date();
      const datetimeAtEnd = moment(datetimeAtStart).clone().add(parseInt(value) || 0, "days");
      changes.endTime = datetimeAtEnd.toDate();
      changes.ETA = datetimeAtEnd.toDate();
      changes.startTime = datetimeAtStart;
    } else {
      changes[name] = value;
    }

    if(name === 'leavingPort_id' || name === 'unloadPort_id') {
      const port = ports.find(p => p.value === value);
      changes[name] = port && port._id;
    }
    this.props.db.update(changes, trip._id);
  }

  getDayChoices(datetimeAtStart) {
    const choices = [...Array(50).keys()].map((num, i) => {
      const date = moment(datetimeAtStart).clone().add(i, "days");
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
    const { trip, ports, vessel } = this.props;
    const val = trip.values(ports)[attribute.id];
    let extraProps = {
      inputId: `${attribute.id}__tripstart__`,
      value: val,
    };
    switch (attribute.id) {
      case "leavingPort_id":
      case "unloadPort_id":
        const portName = trip.values(ports)[attribute.id];
        extraProps.view = 'ports';
        extraProps.choices = ports;
        extraProps.value = val;
      break;
      case "ETA":
        const { startTime, endTime, ETA } = this.props.trip.values();
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
    const { ports, trip } = this.props;
    const styleGap = {
      marginTop: 20,
      flex: 1,
    }
    const vals = trip.values(ports);
    return (
      <View style={styleGap}>
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ TripModel }
          modelValues={ vals }
          index={ 1 }
          onChange={ this.onChange }
          dispatch={ this.props.dispatch }
        />
      </View>
    );
  }
}

const select = (state) => {
  return {
    tripUpdated: state.trip.lastUpdated,
    trip: state.trip.currentTrip,
    vessel: state.vessel.selected,
    ports: state.ports.all,
    db: state.database.db,
  };
}

export default connect(select)(StartTripEditor);
