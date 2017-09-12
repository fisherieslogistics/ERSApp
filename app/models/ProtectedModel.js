
import Validator from '../utils/Validator';
const valid = Validator.valid;

const amountField = {
  label: 'Weight', id: 'amount', valid: valid.greaterThanZero, type: 'number', default: 0, unit: 'kg',
  display: { type: 'child' },
};

const commonAttrs = [
  {
    id: 'id',
    default: null,
  },
  {
    label: 'Type', id: 'type', valid: valid.anyValue, default: "", type: 'string',
  },
  {
    label: 'Species', id: 'code', valid: valid.protectedSpecies, default: "", type:"picker",
    display: { type: 'combined', siblings: ['amount', 'uninjured', 'injured', 'dead'] },
  },
];

const numberOfAttrs = [
  {
    label: 'uninjured', id: 'uninjured', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
  },
  {
    label: 'injured', id: 'injured', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
  },
  {
    label: 'dead', id: 'dead', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
  },
]

const ProtectedModel = [
  ...commonAttrs,
  ...numberOfAttrs,
  amountField,
];

export const ProtectedSpongeModel = [
  ...commonAttrs,
  amountField,
];

export const ProtectedOtherModel = [
  ...commonAttrs,
  ...numberOfAttrs,
];

export default ProtectedModel;
