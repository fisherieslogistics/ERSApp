import Realm from 'realm';
import moment from 'moment';
import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const model = [
  {
    id: 'serverID',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Code',
    id: 'code',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Full Name',
    id: 'fullName',
    valid: Validator.valid.anyValue,
    type: 'string',
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
];

const speciesSchema = generateRealmSchema(model, 'Species');

class SpeciesRealm extends Realm.Object {}
SpeciesRealm.schema = speciesSchema;

export { SpeciesRealm }
export default model
