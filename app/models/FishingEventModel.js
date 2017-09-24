
import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

import TCERModel from './TCERModel';
import LCERModel from './LCERModel';
import HandGatheringEventModel from './HandGatheringEventModel';

import LCERRealm from './realm/LCER';
import TCERRealm from './realm/TCER';
import HandGatheringEventRealm from './realm/HandGatheringEvent';

import FORM_TYPE from '../constants/MPIFormType';

const valid = Validator.valid;

const FishingEventModel = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Number of in Trip', id: 'numberOfInTrip', valid: valid.anyValue,
    type: 'number',
    realm: { type: 'int', optional: true },
  },
  {
    id: 'targetSpecies', valid: valid.targetSpecies,
    'label': 'Target Species',
    type: 'picker',
    default: "",
    display: { type: 'single' },
    repeating: true,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Start Time - Date',
    id: 'RAStart_date',
    valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {
      attributes: ['startDate', 'endDate'],
      func: Validator.combined.startTimeValid,
      errorMessage: "start time must be before end time"
    },
    display: { type: 'combined', siblings: ['startLocation'] },
    optionalRender: true,
    realm: { type: 'date', optional: true },
  },
  {
    id: 'manualStartTime', valid: valid.alwaysValid, default: false,
    realm: { type: 'bool', default: false },
  },
  {
    id: 'manualStartLocation', valid: valid.alwaysValid, default: false,
    realm: { type: 'bool', default: false },
  },
  {
    id: 'manualEndTime', valid: valid.alwaysValid, default: false,
    realm: { type: 'bool', default: false },
  },
  {
    id: 'manualEndLocation', valid: valid.alwaysValid, default: false,
    realm: { type: 'bool', default: false },
  },
  {
    label: 'End Time - Date',
    id: 'RAEnd_date',
    valid: valid.anyValue,
    type: 'datetime',
    /*combinedValid: {
      attributes: ["endDateMoment", "startDateMoment"],
      func: Validator.combined.orderedGreaterThan,
      errorMessage: "end time must be after start time"
    },*/
    display: { type: 'combined', siblings: ['finishLocation'] },
    optionalRender: true, displayStage: 'Haul',
    realm: { type: 'date', optional: true },
  },
  {
    label: 'Location at Start',
    id: 'startLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'child' },
    optionalRender: true,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Location at End of Haul',
    id: 'finishLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'child' },
    optionalRender: true,
    displayStage: 'Haul',
    realm: { type: 'string', optional: true },
  },
  {
    id: 'estimatedCatch',
    valid: valid.alwaysValid,
    default: [],
    realm: { type: 'list', objectType: 'Product' },
  },
  {
    id: 'discards',
    default: [],
    realm: { type: 'list', objectType: 'Discard' },
  },
  {
    id: 'protecteds',
    default: [],
    realm: { type: 'list', objectType: 'ProtectedSpecies' },
  },
  {
    label: 'Non Fish Protected Species',
    type: 'bool',
    id: 'nonFishProtected',
    valid: valid.alwaysValid,
    default: false,
    optionalRender: true,
    realm: { type: 'bool', default: false },
  },
  {
    id: 'completed', valid: valid.alwaysValid, default: false,
    realm: { type: 'bool', default: false },
  },
  {
    id: 'tripRAId',
    realm: { type: 'string', optional: false },
  },
];

/* eslint-disable */
let model = FishingEventModel;
let FishingEventRealm = {};
/* eslint-enable  */

switch (FORM_TYPE){
  case 'LCER':
    model = FishingEventModel.concat(LCERModel);
    FishingEventRealm = LCERRealm;
    break;
  case 'TCER':
    model = FishingEventModel.concat(TCERModel);
    FishingEventRealm = TCERRealm;
    break;
  case 'HandGatheringEvent':
    model = FishingEventModel.concat(HandGatheringEventModel);
    FishingEventRealm = HandGatheringEventRealm;
    console.log(HandGatheringEventRealm);
}

FishingEventRealm.schema = generateRealmSchema(model, 'FishingEvent');

export { FishingEventRealm }

export default model
