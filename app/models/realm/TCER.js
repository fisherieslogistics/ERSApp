import Realm from 'realm';
import moment from 'moment';
import ProductModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import { getLastRecord } from '../../database/RealmHelper';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class TCERRealm extends Realm.Object {

  get startDateMoment() {
    return moment(this.RAStart_date);
  }

  get endDateMoment() {
    return moment(this.RAEnd_date);
  }

  get canEnd() {
    return !this.RAEnd_date;
  }

  get shouldAddEmptyCatch() {
    return !this.estimatedCatch.find(p => !p.code);
  }

  get detailsValid() {
    const {
      targetSpecies,
      wingSpread,
      headlineHeight,
      locationStart,
      RAStart_date,
      RAEnd_date,
      bottomDepth,
      groundropeDepth,
      averageSpeed,
      locationEnd,
    } = this;

    const stage1 = (targetSpecies && wingSpread && headlineHeight && locationStart && RAStart_date);
    if((!RAEnd_date && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(RAStart_date < RAEnd_date);
    const depths = !!(bottomDepth && groundropeDepth);
    return !!(stage1 && !!locationEnd && !!averageSpeed && depths && datesSweet);
  }

  get canSubmit() {
    const {
      detailsValid,
      RAEnd_date,
      estimatedCatchValid,
    } = this;
    return !!(detailsValid && RAEnd_date && estimatedCatchValid)
  }

  get estimatedCatchKg() {
    const catches = [...this.estimatedCatch];
    return catches.map(
      ec => ec.amount).reduce(
        (acc, amount) => acc + amount);
  }

  get estimatedCatchValid() {
    const catchToCheck =  [ ...this.estimatedCatch];
    //last one is always a blank;
    catchToCheck.pop();
    return this.estimatedCatch.length && catchToCheck.every(ec => (ec.code && ec.amount));
  }

  get discardsValid() {
    return !this.discards.length || [ ...this.discards ].every(ec => (ec.code && ec.amount));
  }

  get protectedsValid() {
    return true;
  }

  get locationStartDecimal() {
    return JSONPointToLocation(this.locationStart);
  }

  get locationEndDecimal() {
    return JSONPointToLocation(this.locationEnd);
  }

  get NetLeaveDepthLocationDecimal() {
    return JSONPointToLocation(this.NetLeaveDepthLocation);
  }

  get NetAtDepthLocationDecimal() {
    return JSONPointToLocation(this.NetAtDepthLocation);
  }

  get replicatedEstimatedCatch() {
    if(!this.estimatedCatch) {
      return [];
    }
    return this.estimatedCatch.map(
      c => Object.assign({}, blankModel(ProductModel), { code: c.code, amount: 0, RAId: uuid() }));
  }

  canDelete(latestInTrip) {
    return !this.completed && (this.numberOfInTrip === latestInTrip);
  }

  get nonFishProtectedsExist() {
    return !!this.protecteds.length;
  }

  get fishServeObject() {
    return {
      eventHeader: this.eventHeader,
      method: 'BT',
      targetSpeciesCode: this.targetSpecies,
      mitigationDevicesUsed: [],
      startDateTime: this.RAStart_date,
      locationStart: {
        "systemDateTime": this.locationStartDecimal.timestamp,
        "systemLocation": {
          longitude: this.locationStartDecimal.lon,
          latitude: this.locationStartDecimal.lat,
        },
        isManual: false,
      },
      numberOfNets: 3,
      vesselPairNumber: this.vesselPairNumber,
      wingSpreadMetres: this.wingSpread,
      headlineHeightMetres: this.headlineHeight,
      minMeshSizeMm: this.minMeshSizeMm,
      groundRopeDepthMetres: this.groundropeDepth,
      bottomDepthMetres: this.bottomDepth,
      speedKnots: this.averageSpeed,
      isNetLost: this.isNetLost,
      finishDateTime: this.RAEnd_date,
      finishLocation: {
        "systemDateTime": this.locationEndDecimal.timestamp,
        "systemLocation": {
          longitude: this.locationEndDecimal.lon,
          latitude: this.locationEndDecimal.lat,
        },
        isManual: false
      },
      NetAtDepthDateTime: this.NetAtDepthDateTime,
      NetAtDepthLocation: {
        "systemDateTime": this.NetAtDepthLocationDecimal.timestamp,
        "systemLocation": {
            longitude: this.NetAtDepthLocationDecimal.lon,
            latitude: this.NetAtDepthLocationDecimal.lat,
        }
      },
      NetLeaveDepthDateTime: this.NetLeaveDepthDateTime,
      NetLeaveDepthLocation: {
        "systemDateTime": this.NetLeaveDepthLocationDecimal.timestamp,
        "systemLocation": {
          longitude: this.NetLeaveDepthLocationDecimal.lon,
          latitude: this.NetLeaveDepthLocationDecimal.lat,
        },
        isManual: false
      },
      codendDateTime: this.codendDateTime,
      estimatedCatchKg: this.estimatedCatchKg,
      catches: this.estimatedCatch.map(es => ({
        speciesCode: es.code,
        greenWeightEstimateKg: es.amount,
      })),
      isNonFishOrProtectedSpeciesCatchPresent: this.nonFishProtected,
      nonFishOrProtectedSpeciesCatches: this.protecteds.map(pr => ({
        seabirdCaptureDetails: null,
        estimatedWeightKg: pr.amount,
        numberUninjured: pr.uninjured,
        numberInjured: pr.injured,
        numberDead: pr.dead,
        tags: []
      })),
    }
  }

  get eventHeader() {
    const vessel = getLastRecord('vessel');
    return {
      eventID: this.RAId,
      vesselNumber: vessel.registration,
      isVesselUsed: true,
      notes: 'Create By FLL Reporting',
    }
  }

}
