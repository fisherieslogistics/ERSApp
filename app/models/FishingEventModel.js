
import Validator from '../utils/Validator';

import TrawlEventModel from './TrawlEventModel';
import LCERModel from './LCERModel';
import HandGatheringEventModel from './HandGatheringEventModel';
import FORM_TYPE from '../constants/MPIFormType';
import blankModel from '../utils/ModelUtils';

const valid = Validator.valid;

const FishingEventModel = [
  {
    id: 'id',
    default: null,
  },
  {
    id: 'document_type',
    default: 'fishingEvent',
  },
  {
    label: 'Number in Trip', id: 'numberInTrip', valid: valid.anyValue,
    type: 'number',
  },
  {
    id: 'targetSpecies', valid: valid.targetSpecies,
    'label': 'Target Species',
    type: 'productCodePicker',
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
      attributes: ['datetimeAtStart', 'datetimeAtEnd'],
      func: Validator.combined.datetimeAtStartValid,
      errorMessage: "start time must be before end time"
    },
    display: { type: 'combined', siblings: ['locationAtStart'] },
    optionalRender: true,
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

export default FishingEventModel;
