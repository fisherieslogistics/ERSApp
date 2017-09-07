import Realm from 'realm';

import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';

const valid = Validator.valid;

const VesselModel = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    id: 'name', label: 'Vessel Name', valid: valid.anyValue, default: "TEAM",
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    id: 'registration', default: '52354235', label: "Registration Number", valid: valid.anyValue,
    display: { type: 'single' },
    realm: { type: 'string', optional: true },
  },
  {
    id: 'vessel_id', default: "2342342342424",
    realm: { type: 'string', optional: true },
  }
];

const realmSchema = generateRealmSchema(VesselModel, 'Vessel');

class VesselRealm extends Realm.Object {}

VesselRealm.schema = realmSchema;

export { VesselRealm }

export default VesselModel;
