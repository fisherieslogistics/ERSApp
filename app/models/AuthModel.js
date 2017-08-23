import Realm from 'realm';
import generateRealmSchema from '../database/generateRealmSchema';

const AuthModel = [
  {
    id: 'idToken',
    realm: { type: 'string' },
  },
  {
    id: 'accessToken',
    realm: { type: 'string' },
  },
  {
    id: 'refreshToken',
    realm: { type: 'string' },
  },
];

const realmSchema = generateRealmSchema(AuthModel, 'Auth');

class AuthRealm extends Realm.Object {}

AuthRealm.schema = realmSchema;

export { AuthRealm }

export default AuthModel;
