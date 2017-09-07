import Realm from 'realm';
import moment from 'moment';
import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const model = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Name',
    id: 'name',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Location',
    id: 'location',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  }
];

const portSchema = generateRealmSchema(model, 'Port');

class PortRealm extends Realm.Object {}
PortRealm.schema = portSchema;

export { PortRealm }
export default model
