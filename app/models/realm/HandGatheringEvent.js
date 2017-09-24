import Realm from 'realm';
import moment from 'moment';
import uuid from 'uuid/v1';
import ProductModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import { getLastRecord } from '../../database/RealmHelper';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class HandGatheringEventRealm extends Realm.Object {

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
      startLocation,
      RAStart_date,
      RAEnd_date,
      finishLocation,
    } = this;

    const stage1 = (startLocation && RAStart_date);
    if((!RAEnd_date && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(RAStart_date < RAEnd_date);
    return !!(stage1 && finishLocation && datesSweet);
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

  get replicatedEstimatedCatch() {
    if(!this.estimatedCatch) {
      return [];
    }
    return this.estimatedCatch.map(
      c => Object.assign({}, blankModel(ProductModel), { code: c.code, amount: 0, RAId: uuid() }));
  }

  canDelete() {
    return true;
  }

  get nonFishProtectedsExist() {
    return !!this.protecteds.length;
  }

  toJSON(eventHeader) {

    const startT = moment(this.startLocationDecimal.timestamp);
    const endT = moment(this.finishLocationDecimal.timestamp);
    const json = {
      eventHeader,
      targetSpeciesCode: this.targetSpecies,
      mitigationDevicesUsed: [],
      fishingMethodCode: "H",
      timeSpentHours: parseInt(moment.duration(endT.diff(startT)).asHours()) || 1,
      completedDateTime: moment().format(),
      numberOfPeople: this.numberOfPeople,
      finishLocation: {
        systemDateTime: endT.format(),
        systemLocation: {
          longitude: this.finishLocationDecimal.lon,
          latitude: this.finishLocationDecimal.lat,
          manualDateTime: null,
          manualLocation: null
        },
      },
      startLocation: {
        systemDateTime: startT.format(),
        systemLocation: {
          longitude: this.startLocationDecimal.lon,
          latitude: this.startLocationDecimal.lat,
          manualDateTime: null,
          manualLocation: null
        },
      },
      catches: this.estimatedCatch.filter(t => !!(t.code && t.code.length === 3 && t.amount)).map(es => ({
        speciesCode: es.code,
        greenWeightEstimateKg: es.amount,
      })),
      isNonFishOrProtectedSpeciesCatchPresent: false,
    }

    return JSON.stringify(json);
  }

}
