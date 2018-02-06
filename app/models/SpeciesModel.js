import
import moment from 'moment';
import Validator from '../utils/Validator';

const model = [
  {
    label: 'Code',
    id: 'species_id',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
  },
  {
    id: 'description',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
  },
];


export default model
