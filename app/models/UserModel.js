import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const valid = Validator.valid;

const UserModel = [
  {
    id: 'id',
    default: 0,
    realm: { type: 'int', optional: false },
  },
  {
    id: 'username', default: "4", label: "Username", valid: valid.anyValue,
    display:  { type: 'single'},
    realm: { type: 'string', optional: false },
  },
  {
    id: 'organisation', default: "no organisation", label: "Organisation", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: false },
  },
  {
    id: 'email', default: "somename@someemail.com", label: "Email", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: false },
  },
];

const realmSchema = generateRealmSchema(UserModel, 'User');

class UserRealm extends Realm.Object {}
UserRealm.schema = realmSchema;

export { UserRealm }

export default UserModel;
