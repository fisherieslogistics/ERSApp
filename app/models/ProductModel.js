import

import Validator from '../utils/Validator';

const valid = Validator.valid;

const species = {
  label: 'Species',
  id: 'code',
  valid: valid.productCode,
  default: "",
  type: "productCodePicker",
  display: { type: 'combined', siblings: ['amount'] },

};

const speciesWithState = {
  label: 'Species',
  id: 'code',
  valid: valid.productCode,
  default: "",
  type: "productCodePicker",
  display: { type: 'combined', siblings: ['amount' ] },
  /*combinedValid: {
    attributes: ['code'],
    func: Validator.combined.validSpeciesAndState,
    errorMessage: 'Duplicate species codes must have unique state codes',
  },*/

};

const qma = {
  label: 'QMA',
  id: 'qma',
  valid: valid.alwaysValid,
  default: "",

};

const state = {
  label: 'State',
  id: 'state',
  valid: valid.stateCode,
  default: "GRE",
  type: "productCodePicker",
  display: { type: 'child '},
  combinedValid: {
    attributes: ['code', 'state'],
    func: Validator.combined.validSpeciesAndState,
    errorMessage: 'Duplicate species codes must have unique state codes',
  },

};

const amount = {
  label: 'Green Weight',
  id: 'amount',
  valid: valid.productWeight,
  type: 'number',
  default: 0,
  unit: 'kg',
  display: { type: 'child' },

};
const id = {
  id: 'id',
  default: null,

};
const ProductModel = [species, amount, id];
const DiscardModel = [species, amount, id];


export default ProductModel;
