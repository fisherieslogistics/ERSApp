import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const valid = Validator.valid;

const UserModel = [
  {
    id: 'serverID',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    id: 'firstName', default: "4", label: "First Name", valid: valid.anyValue,
    display:  { type: 'single'},
    realm: { type: 'string', optional: true },
  },
  {
    id: 'lastName', default: "4", label: "Last Name", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: true },
  },
  {
    id: 'permitHolderName', default: "4", label: "Permit Holder Name", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: true },
  },
  {
    id: 'permitHolderNumber', default: "4", label: "Permit Holder Number", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: true },
  },
  {
    id: 'email', default: "4", label: "Email", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: true },
  },
  {
    id: 'auth0ID',
    realm: { type: 'string', optional: true },
  },
];

const realmSchema = generateRealmSchema(UserModel, 'User');

class UserRealm extends Realm.Object {}
UserRealm.schema = realmSchema;

export { UserRealm }

export default UserModel;
