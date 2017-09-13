
import Validator from '../utils/Validator';

const valid = Validator.valid;

const VesselModel = [
  {
    id: 'id',
    default: null,
  },
  {
    id: 'name', label: 'Vessel Name', valid: valid.anyValue, default: "TEAM",
    display: { type: 'single' },
  },
  {
    id: 'registration', default: '52354235', label: "Registration Number", valid: valid.anyValue,
    display: { type: 'single' },
  },
];


export default VesselModel;
