import Validator from '../utils/Validator';

const valid = Validator.valid;

const ConnectionSettingsModel= [
  {
    label: 'Router IP Address',
    id: 'routerIP',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'Name',
    id: 'name',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'iPad IP Address',
    id: 'clientIP',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'Uses UDP Location',
    id: 'udpLocation',
    valid: valid.anyValue,
    display: { type: 'single' },
    type: 'bool',
  },
  {
    label: 'UDP Location Port',
    id: 'udpPort',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'UDP encoding',
    id: 'udpEncoding',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'Target TCP Port',
    id: 'targetTCPPort',
    valid: valid.anyValue,
    display: { type: 'single' },

  },
  {
    label: 'Outbound TCP Port',
    id: 'outboundTCPPort',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'Outbound TCP IP Address',
    id: 'outboundTCPIP',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    label: 'Active',
    id: 'active',
    valid: valid.anyValue,
    display: { type: 'single' },
  },
];

export default ConnectionSettingsModel;
