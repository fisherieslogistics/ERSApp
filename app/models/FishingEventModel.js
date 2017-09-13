
import Validator from '../utils/Validator';

import TCERModel from './TCERModel';
import LCERModel from './LCERModel';
import HandGatheringEventModel from './HandGatheringEventModel';

import FORM_TYPE from '../constants/MPIFormType';

const valid = Validator.valid;

const FishingEventModel = [
  {
    id: 'id',
    default: null,

  },
  {
    label: 'Number in Trip', id: 'numberInTrip', valid: valid.anyValue,
    type: 'number',

  },
  {
    id: 'targetSpecies', valid: valid.targetSpecies,
    'label': 'Target Species',
    type: 'picker',
    default: "",
    display: { type: 'single' },
    repeating: true,

  },
  {
    label: 'Start Time - Date',
    id: 'datetimeAtStart',
    valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {
      attributes: ['startDate', 'endDate'],
      func: Validator.combined.startTimeValid,
      errorMessage: "start time must be before end time"
    },
    display: { type: 'combined', siblings: ['locationStart'] },
    optionalRender: true,

  },
  {
    id: 'manualStartTime', valid: valid.alwaysValid, default: false,

  },
  {
    id: 'manualStartLocation', valid: valid.alwaysValid, default: false,

  },
  {
    id: 'manualEndTime', valid: valid.alwaysValid, default: false,

  },
  {
    id: 'manualEndLocation', valid: valid.alwaysValid, default: false,

  },
  {
    label: 'End Time - Date',
    id: 'datetimeAtEnd',
    valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {
      attributes: ["datetimeAtEnd", "datetimeAtStart"],
      func: Validator.combined.orderedGreaterThan,
      errorMessage: "end time must be after start time"
    },
    display: { type: 'combined', siblings: ['locationAtEnd'] },
    optionalRender: true, displayStage: 'Haul',

  },
  {
    label: 'Location at Start',
    id: 'locationAtStart',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'child' },
    optionalRender: true,

  },
  {
    label: 'Location at End of Haul',
    id: 'locationAtEnd',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'child' },
    optionalRender: true,
    displayStage: 'Haul',

  },
  {
    id: 'committed', valid: valid.alwaysValid, default: false,

  },
  {
    id: 'trip_id',

  },
  {
    id: 'eventSpecificDetails',

  },
  {
    id: 'mitigationDeviceCodes',

  },
  {
    id: 'vesselNumber',

  },
  {
    id: 'amendmentReason',

  },
  {
    id: 'creator',

  },
  {
    id: 'archived',

  },
  {
    id: 'notes',

  },
  {
    id: 'isVesselUsed',

  },
  {
    id: 'lineString',

  },
];

/* eslint-disable */
let model = FishingEventModel;
/* eslint-enable  */

switch (FORM_TYPE){
  case 'LCER':
    model = FishingEventModel.concat(LCERModel);

    break;
  case 'TCER':
    model = FishingEventModel.concat(TCERModel);

    break;
  case 'HandGatheringEvent':
    model = FishingEventModel.concat(HandGatheringEventModel);


}

export default model
