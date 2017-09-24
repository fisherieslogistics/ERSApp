import Validator from '../utils/Validator';
const combined = Validator.combined;
const valid = Validator.valid;

const TCERModel = [
  {
    id: 'fishingMethod',
    default: 'BT',
    repeating: true,
    realm: { type: 'string' },
  },
  {
    label: 'Bottom Depth',
    id: 'bottomDepthMetres',
    valid: valid.greaterThanZero,
    type: 'number',
    unit: 'm',
    default: 0,
    display: { type: 'combined', siblings: ['groundRopeDepthMetres'] },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Number of Nets',
    id: 'numberOfNets',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 1,
    repeating: true,
    display: { type: 'single' },
    realm: { type: 'int' },
  },
  {
    label: 'Estimated Total Bag Size',
    id: 'estimatedCatchKg',
    valid: valid.anyValue,
    type: 'number',
    default: 0,
    repeating: true,
    displayStage: 'Haul',
    unit: 'kg',
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Vessel Pair Number',
    id: 'vesselPairNumber',
    valid: valid.anyValue,
    type: 'number',
    default: null,
    repeating: true,
    //display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Cod End Mesh Size',
    id: 'codendMeshSizeMm',
    valid: valid.greaterThanZero,
    type: 'float',
    default: 0,
    unit: 'mm',
    repeating: true,
    display: { type: 'single' },
    realm: { type: 'int' },
  },
  {
    label: 'Groundrope Depth',
    id: 'groundRopeDepthMetres',
    valid: valid.greaterThanZero,
    type: 'number',
    default: 0,
    combinedValid:
      {
        attributes: ["groundRopeDepthMetres", "bottomDepthMetres"],
        func: combined.orderedLessThanOrEqual,
        errorMessage: "Groundrope cannot be below the bottom"
      },
    display: { type: 'child'}, unit: 'm', optionalRender: false,
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Wing Spread',
    id: 'wingSpreadMetres',
    valid: valid.greaterThanZero,
    type: 'number',
    repeating: true,
    display: { type: 'combined', siblings: ['headlineHeightMetres']}, unit: 'm', order: 1, optionalRender: true,
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Headline Height',
    id: 'headlineHeightMetres',
    valid: valid.greaterThanZero,
    type: 'float',
    unit: 'm',
    default: 0,
    optionalRender: true,
    repeating: true,
    display: { type: 'child'},
    realm: { type: 'float', optional: true },
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
    id: 'formType', default: 'TCER',
    realm: { type: 'string', default: 'TCER' },
  },
  {
    id: 'estimatedCatchKg', default: 0,
    realm: { type: 'int', default: 0 },
  },
  {
    id: 'committed', default: false,
    realm: { type: 'bool', default: false, optional: true },
  }
];

export default TCERModel;
