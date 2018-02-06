import moment from 'moment';
import TripModel from '../../models/TripModel';

import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class TripEvent {


  constructor(trip) {
    this.trip = {};
    this._id = trip._id;
    TripModel.forEach(attr => {
      this.trip[attr.id] = trip[attr.id];
    });
    this.trip._id = trip._id;
  }

  values = (ports, vessel) => {
    const { trip } = this;
    if(ports) {

      const leavingPort_id = ports.find(p => p._id === trip.leavingPort_id);
      const unloadPort_id = ports.find(p => p._id === trip.unloadPort_id);

      return Object.assign({}, trip, {
        leavingPort_id: leavingPort_id && leavingPort_id.value,
        unloadPort_id: unloadPort_id && unloadPort_id.value,
      });

    }
    return trip;
  }

  setValues(values) {
    this.trip = Object.assign({}, this.trip, values);
  }

  setValue(change) {
    this.trip = Object.assign({}, this.trip, change);
  }

  get datetimeAtStartMoment() {
    return moment(this.trip.startTime);
  }

  get datetimeAtEndMoment() {
    return moment(this.trip.endTime);
  }

  get canStart() {
    return this.trip.active === false && this.trip.leavingPort_id && this.trip.unloadPort_id &&
           this.trip.ETA;
  }

  canEnd = (fishingEvents) => {
    return !!this.trip.active;// && fishingEvents.every(fe => !!fe.completed);
  }

}
