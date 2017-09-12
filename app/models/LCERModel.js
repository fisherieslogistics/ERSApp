
import Validator from '../utils/Validator';
const valid = Validator.valid;

const LCERModel = [
  {
    id: 'fishingMethod',
    default: 'BLL',
  },
  {
    label: 'Shot Finish Time',
    id: 'RAShotFinishTime',
    display: { type: 'single'},
    valid: valid.anyValue,
    type: 'datetime',
  },
  {
    label: 'Bottom Depth',
    id: 'bottomDepth',
    valid: valid.greaterThanZero,
    type: 'number',
    unit: 'm',
    default: 0,
    display: { type: 'single' },
  },
  {
    label: 'Hook Spacing',
    id: 'hookSpacing',
    valid: valid.greaterThanZero,
    type: 'float',
    display: { type: 'single' },
  },
  {
    label: 'Number of Hooks',
    id: 'numberOfHooks',
    valid: valid.greaterThanZero,
    type: 'number',
    display: { type: 'single' },
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
  },
  {
    id: 'formType', default: 'LCER',
  },
  {
    id: 'otherSpeciesWeight', default: 0,
  },
];

export default LCERModel;
