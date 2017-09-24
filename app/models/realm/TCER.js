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
      wingSpreadMetres,
      headlineHeightMetres,
      startLocation,
      RAStart_date,
      RAEnd_date,
      bottomDepthMetres,
      groundRopeDepthMetres,
      averageSpeed,
      finishLocation,
    } = this;
    console.log(targetSpecies, wingSpreadMetres, headlineHeightMetres, startLocation, RAStart_date);
    const stage1 = (targetSpecies && wingSpreadMetres && headlineHeightMetres && startLocation && RAStart_date);
    if((!RAEnd_date && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(RAStart_date < RAEnd_date);
    const depths = !!(bottomDepthMetres && groundRopeDepthMetres);
    console.log(datesSweet, depths);
    console.log(stage1, finishLocation, averageSpeed, depths, datesSweet);
    return !!(stage1 && !!finishLocation && !!averageSpeed && depths && datesSweet);
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

  get startLocationDecimal() {
    return JSONPointToLocation(this.startLocation);
  }

  get finishLocationDecimal() {
    return JSONPointToLocation(this.finishLocation);
  }

  get NetLeaveDepthLocationDecimal() {
    return JSONPointToLocation(this.startLocation);
  }

  get startLocationDecimal() {
    return JSONPointToLocation(this.startLocation);
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
  
  toJSON(eventHeader) {

    const obj =  {
      eventHeader,  
      fishingMethodCode:'BT',
      targetSpeciesCode:this.targetSpecies,
      mitigationDeviceCodes: [],
      startLocation: {
        systemDateTime: this.startDateMoment.format(),
        systemLocation: {
          longitude: this.startLocationDecimal.lon,
          latitude: this.startLocationDecimal.lat,
        },
      },
      finishLocation: {
        systemDateTime: this.endDateMoment.format(),
        systemLocation: {
          latitude: this.finishLocationDecimal.lat,
          longitude: this.finishLocationDecimal.lon,
        },
      },
      numberOfNets: this.numberOfNets,
      vesselPairNumber: null,
      wingSpreadMetres: this.wingSpreadMetres,
      headlineHeightMetres: this.headlineHeightMetres,
      codendMeshSizeMm: this.codendMeshSizeMm,
      groundRopeDepthMetres: this.groundRopeDepthMetres,
      bottomDepthMetres: this.bottomDepthMetres,
      speedKnots: this.averageSpeed,
      isNetLost: false,
      estimatedCatchKg: this.estimatedCatchKg,
      catches: this.estimatedCatch.filter(t => !!(t.code && t.code.length === 3 && t.amount)).map(es => ({
        speciesCode: es.code,
        greenWeightEstimateKg: es.amount,
      })),
    };
    return JSON.stringify(obj);
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
