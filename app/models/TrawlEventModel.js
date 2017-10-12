
import Validator from '../utils/Validator';
const combined = Validator.combined;
const valid = Validator.valid;

const TrawlEventModel = [
  {
    id: 'fishingMethod',
    default: 'BT',
    repeating: true,
  },
  /*{
    label: 'Bottom Depth',
    id: 'bottomDepth',
    valid: valid.greaterThanZero,
    type: 'number',
    unit: 'm',
    default: 0,
    display: { type: 'combined', siblings: ['groundropeDepth'] },

  },*/
  {
    label: 'Number of People',
    id: 'numberOfNets',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 1,
    repeating: true,
    display: { type: 'single' },
  },
  /*{
    label: 'Estimated Total Bag Size',
    id: 'estimatedCatchKg',
    valid: valid.anyValue,
    type: 'number',
    default: 0,
    repeating: true,
    displayStage: 'Haul',
    unit: 'kg',
    display: { type: 'single' },

  },
  {
    label: 'Vessel Pair Number',
    id: 'vesselPairNumber',
    valid: valid.anyValue,
    type: 'number',
    default: null,
    repeating: true,
    display: { type: 'single' },

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

  },
  {
    label: 'Start of Haul Location',
    id: 'NetLeaveDepthLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    copyFrom: 'datetimeAtEnd',
    displayStage: 'Haul',
    display: { type: 'single' },
    optionalRender: true,

  },
  {
    label: 'Start Of Haul Time',
    id: 'NetLeaveDepthDateTime',
    valid: valid.anyValue,
    type: 'datetime',
    default: null,
    copyFrom: 'datetimeAtEnd',
    display: { type: 'single' },
    optionalRender: true,

  },
  {
    label: 'End Of Shot Location',
    id: 'NetAtDepthLocation',
    valid: valid.locationValid,
    type: 'location',
    default: null,
    copyFrom: 'locationAtStart',
    display: { type: 'single' },
    optionalRender: true,

  },
  {
    label: 'End Of Shot Time',
    id: 'NetAtDepthDateTime',
    valid: valid.anyValue,
    type: 'datetime',
    default: null,
    copyFrom: 'datetimeAtStart',
    display: { type: 'single' },
    optionalRender: true,

  },
  {
    label: 'Code End Time',
    id: 'codendDateTime',
    valid: valid.anyValue,
    type: 'datetime',
    default: null,
    copyFrom: 'datetimeAtEnd',
    displayStage: 'Haul',
    display: { type: 'single' },
    optionalRender: true,

  },*/
  {
    label: 'Is Net Lost',
    id: 'isNetLost',
    valid: valid.anyValue,
    type: 'bool',
    default: false,
    displayStage: 'Haul',
    display: { type: 'single' },

  },
  /*{
    label: 'Groundrope Depth',
    id: 'groundropeDepth',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 0,
    combinedValid:
      {
        attributes: ["groundropeDepth", "bottomDepth"],
        func: combined.orderedLessThanOrEqual,
        errorMessage: "Groundrope cannot be below the bottom"
      },
    display: { type: 'child'}, unit: 'm', optionalRender: false,

  },
  {
    label: 'Wing Spread',
    id: 'wingSpread',
    valid: valid.greaterThanZero,
    type: 'number',
    repeating: true,
    display: { type: 'combined', siblings: ['headlineHeight']}, unit: 'm', order: 1, optionalRender: true,

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
    display: { type: 'child'},

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

  },*/
  {
    id: 'formType', default: 'TrawlEvent',

  },
  /*{
    id: 'otherSpeciesWeight', default: 0,

  },*/
  {
    id: 'committed', default: false,

  }
];

export default TrawlEventModel;
