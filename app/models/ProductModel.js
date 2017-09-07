import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const valid = Validator.valid;

const species = {
  label: 'Species',
  id: 'code',
  valid: valid.productCode,
  default: "",
  type: "productCodePicker",
  display: { type: 'combined', siblings: ['amount'] },
  realm: { type: 'string', optional: true },
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
  realm: { type: 'string', optional: true },
};

const qma = {
  label: 'QMA',
  id: 'qma',
  valid: valid.alwaysValid,
  default: "",
  realm: { type: 'string', optional: true },
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
  realm: { type: 'string', default: "GRE" },
};

const amount = {
  label: 'Green Weight',
  id: 'amount',
  valid: valid.productWeight,
  type: 'number',
  default: 0,
  unit: 'kg',
  display: { type: 'child' },
  realm: { type: 'int', optional: true },
};
const id = {
  id: 'id',
  default: null,
  realm: { type: 'string', optional: true },
};
const ProductModel = [species, amount, id];
const DiscardModel = [species, amount, id];

const productSchema = generateRealmSchema(ProductModel, 'Product');
const discardSchema = generateRealmSchema(DiscardModel, 'Discard');

class DiscardRealm extends Realm.Object {}
DiscardRealm.schema = discardSchema;

class ProductRealm extends Realm.Object {}
ProductRealm.schema = productSchema;


export { DiscardModel, DiscardRealm, ProductRealm, }
export default ProductModel;
