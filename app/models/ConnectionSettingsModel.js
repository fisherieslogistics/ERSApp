import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';
import Realm from 'realm';

const valid = Validator.valid;

const ConnectionSettingsModel= [
  {
    label: 'Router IP Address',
    id: 'routerIP',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Name',
    id: 'name',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'iPad IP Address',
    id: 'clientIP',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Uses UDP Location',
    id: 'udpLocation',
    valid: valid.anyValue,
    display: { type: 'single' },
    type: 'bool',
    realm: { type: 'bool', optional: true },
  },
  {
    label: 'UDP Location Port',
    id: 'udpPort',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'UDP encoding',
    id: 'udpEncoding',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Target TCP Port',
    id: 'targetTCPPort',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Outbound TCP Port',
    id: 'outboundTCPPort',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'int', optional: true },
  },
  {
    label: 'Outbound TCP IP Address',
    id: 'outboundTCPIP',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Active',
    id: 'active',
    valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'bool', default: false },
  },
];

class ConnectionSettingsRealm extends Realm.Object {}

ConnectionSettingsRealm.schema = generateRealmSchema(ConnectionSettingsModel, 'ConnectionSettings');

export { ConnectionSettingsRealm }

export default ConnectionSettingsModel;
