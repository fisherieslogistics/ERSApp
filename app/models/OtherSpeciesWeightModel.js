import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {
    label: 'Other Species Weight', id: 'otherSpeciesWeight', valid: valid.anyValue, type: 'number', unit: 'kg',
    display: { type: 'single' },
  },
];

export default model;
