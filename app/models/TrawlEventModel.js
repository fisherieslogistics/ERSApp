
import Validator from '../utils/Validator';
const combined = Validator.combined;
const valid = Validator.valid;

const TrawlEventModel = [
  {
    id: 'fishingMethod',
    default: 'BT',
    repeating: true,
  },
  {
    label: 'Shot Location',
    hint: '  ** press shoot when you put the brakes on the winches',
    id: 'NetAtDepthLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'single' },
  },
  {
    label: 'Hauling Location',
    hint: '** press Haul once you engage winches',
    id: 'NetLeaveDepthLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    display: { type: 'single' },
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
    label: 'Groundrope Depth',
    id: 'groundropeDepth',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 0,
    copyFrom: 'bottomDepth',
    combinedValid:
      {
        attributes: ["groundropeDepth", "bottomDepth"],
        func: combined.orderedLessThanOrEqual,
        errorMessage: "Groundrope cannot be below the bottom"
      },
    display: { type: 'single' },
    unit: 'm',
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
    label: 'Estimated Total Bag Size',
    id: 'estimatedCatchKg',
    valid: valid.anyValue,
    type: 'number',
    default: 0,
    displayStage: 'Haul',
    unit: 'kg',
    display: { type: 'single' },
    optionalRender: true,

  },
  {
    label: 'Is Net Lost',
    id: 'isNetLost',
    valid: valid.anyValue,
    type: 'bool',
    default: false,
    displayStage: 'Haul',
    display: { type: 'single' },
    optionalRender: true,
  },
  {
    label: 'Wing Spread',
    id: 'wingSpread',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 0,
    repeating: true,
    display: { type: 'single' },
    unit: 'm', order: 1, optionalRender: true,
  },
  {
    label: 'Headline Height',
    id: 'headlineHeight',
    valid: valid.greaterThanZero,
    type: 'float',
    unit: 'm',
    default: 0,
    optionalRender: true,
    repeating: true,
    display: { type: 'single'},
    optionalRender: true,
  },
  {
    label: 'Vessel Pair Number',
    id: 'vesselPairNumber',
    valid: valid.anyValue,
    type: 'number',
    default: null,
    repeating: true,
    display: { type: 'single' },
    optionalRender: true,
  },
  {
    label: 'Minimum Mesh Size',
    id: 'minMeshSizeMm',
    valid: valid.greaterThanZero,
    type: 'float',
    default: 0,
    unit: 'mm',
    repeating: true,
    display: { type: 'single' },
    optionalRender: true,
  },
  {
    id: 'formType', default: 'TrawlEvent',
  },
  {
    id: 'committed', default: false,
  }
];

export default TrawlEventModel;
