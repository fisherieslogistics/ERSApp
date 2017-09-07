import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';
const valid = Validator.valid;

const amountField = {
  label: 'Weight', id: 'amount', valid: valid.greaterThanZero, type: 'number', default: 0, unit: 'kg',
  display: { type: 'child' },
  realm: { type: 'int', optional: true },
};

const commonAttrs = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Type', id: 'type', valid: valid.anyValue, default: "", type: 'string',
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Species', id: 'code', valid: valid.protectedSpecies, default: "", type:"picker",
    display: { type: 'combined', siblings: ['amount', 'uninjured', 'injured', 'dead'] },
    realm: { type: 'string', optional: true },
  },
];

const numberOfAttrs = [
  {
    label: 'uninjured', id: 'uninjured', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
    realm: { type: 'int', default: 0 },
  },
  {
    label: 'injured', id: 'injured', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
    realm: { type: 'int', default: 0 },
  },
  {
    label: 'dead', id: 'dead', valid: valid.notNegative, type: 'number', default: 0,
    display: { type: 'child' },
    realm: { type: 'int', default: 0 },
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

const genericSchema = generateRealmSchema(ProtectedModel, 'ProtectedSpecies');
class ProtectedSpeciesRealm extends Realm.Object {}
ProtectedSpeciesRealm.schema = genericSchema;

export { ProtectedSpeciesRealm }

export default ProtectedModel;
