
import Validator from '../utils/Validator';

const valid = Validator.valid;

const species = {
  label: 'Species',
  id: 'species_id',
  valid: valid.productCode,
  default: "",
  type: "productCodePicker",
  display: { type: 'combined', siblings: ['weightKgs'] },

};

/*const speciesWithState = {
  label: 'Species',
  id: 'species_id',
  valid: valid.productCode,
  default: "",
  type: "productCodePicker",
  display: { type: 'combined', siblings: ['weightKgs' ] },
  /*combinedValid: {
    attributes: ['species_id'],
    func: Validator.combined.validSpeciesAndState,
    errorMessage: 'Duplicate species codes must have unique state codes',
  },*/

//};

const qma = {
  label: 'QMA',
  id: 'qma',
  valid: valid.alwaysValid,
  default: "",

};

/*const state = {
  label: 'State',
  id: 'state',
  valid: valid.stateCode,
  default: "GRE",
  type: "productCodePicker",
  display: { type: 'child '},
  combinedValid: {
    attributes: ['species_id', 'state'],
    func: Validator.combined.validSpeciesAndState,
    errorMessage: 'Duplicate species codes must have unique state codes',
  },

};*/

const weightKgs = {
  label: 'Green Weight',
  id: 'weightKgs',
  valid: valid.alwaysValid,
  type: 'number',
  default: 0,
  unit: 'kg',
  display: { type: 'child' },

};
const id = {
  id: 'id',
  default: null,

};
const ProductModel = [species, weightKgs, id];
const DiscardModel = [species, weightKgs, id];


export default ProductModel;
