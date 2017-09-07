import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const valid = Validator.valid;

const UserModel = [
  {
    id: 'user_id',
    default: 0,
    realm: { type: 'int', optional: false },
  },
  {
    id: 'username', default: "", label: "Username", valid: valid.anyValue,
    display:  { type: 'single'},
    realm: { type: 'string', optional: false },
  },
  {
    id: 'email', default: "", label: "Email", valid: valid.anyValue,
    display: { type: 'single'},
    realm: { type: 'string', optional: false },
  },
];

const realmSchema = generateRealmSchema(UserModel, 'User');

class UserRealm extends Realm.Object {}
UserRealm.schema = realmSchema;

export { UserRealm }

export default UserModel;
