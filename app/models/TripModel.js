import moment from 'moment';
import Validator from '../utils/Validator';
import FORM_TYPE from '../constants/MPIFormType';


const TrawlEventFields = [

  {
    label: 'Wing Spread',
    id: 'wingSpread',
    valid: Validator.valid.greaterThanZero,
    type: 'number',
    display: { type: 'single' }, unit: 'm',
  },
  {
    label: 'Headline Height',
    id: 'headlineHeight',
    valid: Validator.valid.greaterThanZero,
    type: 'float', unit: 'm',
    display: { type: 'single'},
  },
]

const LCERFields = [
  {
    label: 'Hook Spacing',
    id: 'hookSpacing',
    valid: Validator.valid.greaterThanZero,
    type: 'float',
    display: { type: 'single' },

  },
]

const TripModel = [
  {
    id: 'id',
    default: null,
  },
  {
    id: 'creator',
    default: null,
  },
  {
    id: 'startLocation',
    default: null,
  },
  {
    id: 'endLocation',
    default: null,
  },
  {
    id: 'vessel_id',
    default: null,
  },
  {
   label: 'Sailing From',
   id: 'leavingPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
  },
  {
   label: 'Expected Unload Port',
   id: 'unloadPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
  },
  {
   label: 'Sailing Date',
   id: 'datetimeAtStart',
   valid: Validator.valid.datetimeAtStartValid,
   type: 'datetime',
  },
  {
   id: 'datetimeAtEnd',
   valid: Validator.valid.alwaysValid,
   type: 'datetime',
  },
  {
   label: 'Estimated Days Left In Trip',
   id: 'ETA',
   valid: Validator.valid.tripDate,
   type: 'picker', unit: '',
   display: { type: 'single'},
  },
];

let specificFields = [];

switch(FORM_TYPE) {
  case 'LCER':
    specificFields = LCERFields;
    break;
  case 'TrawlEvent':
    specificFields = TrawlEventFields;
    break;
}

const model = TripModel.concat(specificFields);

export class TripHelper {

  constructor(trip, fishingEvents = []) {
    this.trip = trip;
    this.fishingEvents = fishingEvents;
  }

  get values() {
    return this.trip;
  }
  
  setFishingEvents(fishingEvents) {
    this.fishingEvents = fishingEvents;
  }
  
  setValues(values) {
    this.trip = Object.assign({}, this.trip, values);
  }

  setValue(change) {
    this.trip = Object.assign({}, this.trip, change);
  }

  get datetimeAtStartMoment() {
    return moment(this.trip.datetimeAtStart);
  }

  get datetimeAtEndMoment() {
    return moment(this.trip.datetimeAtEnd);
  }

  get canStartEvent() {
    if(!this.trip.started) {
      return false;
    }
    /*if(!this.lastEvent){
      return true;
    }*/
    if(FORM_TYPE === 'LCER') {
      return true;
    }
    return true;//!!this.lastEvent.datetimeAtEnd;
  }

  get canEndEvent() {
    if(!this.trip.started) {
      return false;
    }
    if(!this.lastEvent){
      return false;
    }
    return this.lastEvent.canEnd;
  }

  get canStart() {
    return !this.trip.started && this.trip.leavingPort && this.trip.unloadPort &&
           this.trip.datetimeAtStart && this.trip.datetimeAtEnd;
  }

  get canEnd() {
    return this.trip.started && this.fishingEvents.every(fe => !!fe.completed);
  }

}

export default model
