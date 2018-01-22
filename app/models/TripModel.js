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
    id: 'document_type',
    default: 'trip',
  },
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
   id: 'leavingPort_id',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
  },
  {
   label: 'Expected Unload Port',
   id: 'unloadPort_id',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
  },
  {
   label: 'Sailing Date',
   id: 'startTime',
   valid: Validator.valid.datetimeAtStartValid,
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
  {
    id: 'started',
    default: false,
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
export default model;
