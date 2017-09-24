
import Validator from '../utils/Validator';
const valid = Validator.valid;

const LCERModel = [
  {
    id: 'fishingMethod',
    default: 'BLL',
    realm: { type: 'string' },
  },
  {
    label: 'Shot Finish Time',
    id: 'RAShotFinishTime',
    display: { type: 'single'},
    valid: valid.anyValue,
    type: 'datetime',
    realm: { type: 'date', optional: true },
  },
  {
    label: 'Bottom Depth',
    id: 'bottomDepthMetres',
    valid: valid.greaterThanZero,
    type: 'number',
    unit: 'm',
    default: 0,
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Hook Spacing',
    id: 'hookSpacing',
    valid: valid.greaterThanZero,
    type: 'float',
    display: { type: 'single' },
    realm: { type: 'float', optional: true, unit: 'm' },
  },
  {
    label: 'Number of Hooks',
    id: 'numberOfHooks',
    valid: valid.greaterThanZero,
    type: 'number',
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Average Speed',
    id: 'averageSpeed',
    valid: valid.greaterThanZero,
    type: 'float',
    default: 0,
    display: { type: 'single'},
    unit: 'kt',
    optionalRender: true,
    displayStage: 'Haul',
    realm: { type: 'float', optional: true },
  },
  {
    id: 'formType', default: 'LCER',
    realm: { type: 'string', default: 'LCER' },
  },
  {
    id: 'otherSpeciesWeight', default: 0,
    realm: { type: 'int', default: 0 },
  },

];

export default LCERModel;
