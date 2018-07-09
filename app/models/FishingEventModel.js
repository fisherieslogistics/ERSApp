
import Validator from '../utils/Validator';

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
    id: 'targetSpecies_id', valid: valid.targetSpecies_id,
    'label': 'Target Species',
    type: 'productCodePicker',
    default: '',
    display: { type: 'single' },
    repeating: true,
  },
  {
    id: 'locationAtStart',
    valid: valid.alwaysValid,
    default: null,
  },
  {
    id: 'locationAtEnd',
    valid: valid.alwaysValid,
    default: null,
  },
  {
    label: 'Start Time - Date',
    id: 'datetimeAtStart',
    valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {
      attributes: ['datetimeAtStart', 'datetimeAtEnd'],
      func: Validator.combined.datetimeAtStartValid,
      errorMessage: 'start time must be before end time',
    },
    display: { type: 'single' },
    optionalRender: true,
  },
  {
    label: 'End Time - Date',
    id: 'datetimeAtEnd',
    valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {
      attributes: ['datetimeAtEnd', 'datetimeAtStart'],
      func: Validator.combined.orderedGreaterThan,
      errorMessage: 'end time must be after start time',
    },
    display: { type: 'single' },
    optionalRender: true, displayStage: 'Haul',
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
    id: 'archived', default: false,
  },
  {
    id: 'notes',
  },
  {
    id: 'isVesselUsed', default: true,
  },
  {
    id: 'lineString',
  },
  {
    id: 'committed', default: false,
  },
  {
    id: 'vesselNumber', default: 999,
  },
];

export default FishingEventModel;
