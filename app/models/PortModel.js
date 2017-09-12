import
import moment from 'moment';
import Validator from '../utils/Validator';

const model = [
  {
    id: 'id',
    default: null,
  },
  {
    label: 'Name',
    id: 'name',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
  },
  {
    label: 'Location',
    id: 'location',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
  }
];


export default model
