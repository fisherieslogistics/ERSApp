import Realm from 'realm';
import moment from 'moment';
import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';
import FORM_TYPE from '../constants/MPIFormType';


const TCERFields = [

  {
    label: 'Wing Spread',
    id: 'wingSpread',
    valid: Validator.valid.greaterThanZero,
    type: 'number',
    display: { type: 'single' }, unit: 'm',
    realm: { type: 'int', default: 0, optional: true },
  },
  {
    label: 'Headline Height',
    id: 'headlineHeight',
    valid: Validator.valid.greaterThanZero,
    type: 'float', unit: 'm',
    display: { type: 'single'},
    realm: { type: 'float', default: 0, optional: true },
  },
]

const LCERFields = [
  {
    label: 'Hook Spacing',
    id: 'hookSpacing',
    valid: Validator.valid.greaterThanZero,
    type: 'float',
    display: { type: 'single' },
    realm: { type: 'float', optional: true, unit: 'm' },
  },
]

const TripModel = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    id: 'startLocation',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    id: 'endLocation',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    id: 'vessel',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
   label: 'Sailing From',
   id: 'leavingPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
   realm: { type: 'string', optional: true },
  },
  {
   label: 'Expected Unload Port',
   id: 'unloadPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
   realm: { type: 'string', optional: true },
  },
  {
   label: 'Sailing Date',
   id: 'startTime',
   valid: Validator.valid.startTimeValid,
   type: 'datetime',
   realm: { type: 'date', optional: true },
  },
  {
   id: 'endTime',
   valid: Validator.valid.alwaysValid,
   type: 'datetime',
   realm: { type: 'date', optional: true },
  },
  {
   label: 'Estimated Days Left In Trip',
   id: 'ETA',
   valid: Validator.valid.tripDate,
   type: 'picker', unit: '',
   display: { type: 'single'},
   realm: { type: 'date', optional: true },
  },
  {
    id: 'started',
    default: false,
    valid: Validator.valid.alwaysValid,
    type: 'bool',
    realm: { type: 'bool', default: false, optional: true  },
  },
  {
    id: 'fishingEvents',
    default: [],
    realm: { type: 'list', objectType: 'FishingEvent', default: [] },
  },
  {
    id: 'complete',
    default: false,
    valid: Validator.valid.alwaysValid,
    type: 'bool',
    realm: { type: 'bool', default: false, optional: true },
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

const realmSchema = generateRealmSchema(model, 'Trip');

class TripRealm extends Realm.Object {

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
TripRealm.schema = realmSchema;

export { TripRealm }

export default model
