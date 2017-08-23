import Realm from 'realm';
import { FishingEventRealm } from '../models/FishingEventModel';
import { TripRealm } from '../models/TripModel';
import { ProductRealm, DiscardRealm } from '../models/ProductModel';
import { VesselRealm } from '../models/VesselModel';
import { ProtectedSpeciesRealm } from '../models/ProtectedModel';
import { UserRealm } from '../models/UserModel';
import { ConnectionSettingsRealm } from '../models/ConnectionSettingsModel';

const url = 'http://127.0.0.1:9080';
let realm;

export function getRealm() {
  return realm;
}

const realmSchema = {
  schema: [
    FishingEventRealm,
    TripRealm,
    ProductRealm,
    DiscardRealm,
    VesselRealm,
    ProtectedSpeciesRealm,
    UserRealm,
    ConnectionSettingsRealm,
  ],
};

export function startRealm(fllUser) {
  return new Promise((resolve) => {
    realm = new Realm(realmSchema);
    resolve(realm);
    /*Realm.Sync.User.login(
      url,
      fllUser.email,
      fllUser.userId,
      (error, user) => {
        if(!error && user){
         realmSchema.sync = {
            user,
            url: 'realm://127.0.0.1:9080/~/' + fllUser.userId,
          };
        }

        realm = new Realm(realmSchema);
        resolve(realm);
      });*/
  });

}

const classMapper = {
  fishingEvent: FishingEventRealm,
  trip: TripRealm,
  product: ProductRealm,
  discard: DiscardRealm,
  vessel: VesselRealm,
  protected: ProtectedSpeciesRealm,
  user: UserRealm,
  connectionSettings: ConnectionSettingsRealm,
};

export {
  classMapper,
};
