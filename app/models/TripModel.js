import moment from 'moment';
import Validator from '../utils/Validator';
import FORM_TYPE from '../constants/MPIFormType';


const TCERFields = [

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
   id: 'startTime',
   valid: Validator.valid.startTimeValid,
   type: 'datetime',
  },
  {
   id: 'endTime',
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
  case 'TCER':
    specificFields = TCERFields;
    break;
}

const model = TripModel.concat(specificFields);

class addon {

  get startDateMoment() {
    return moment(this.startTime);
  }

  get endDateMoment() {
    return moment(this.endTime);
  }

  get lastEvent() {
    return [...this.fishingEvents].pop();
  }

  get canStartEvent() {
    if(!this.started) {
      return false;
    }
    if(!this.lastEvent){
      return true;
    }
    if(FORM_TYPE === 'LCER') {
      return true;
    }
    return !!this.lastEvent.endTime;
  }

  get canEndEvent() {
    if(!this.started) {
      return false;
    }
    if(!this.lastEvent){
      return false;
    }
    return this.lastEvent.canEnd;
  }

  get canStart() {
    return !this.started && this.leavingPort && this.unloadPort &&
           this.startTime && this.endTime;
  }

  get canEnd() {
    return this.started && this.fishingEvents.every(fe => !!fe.completed);
  }



}

export default model
