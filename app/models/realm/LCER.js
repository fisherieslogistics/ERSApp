import Realm from 'realm';
import moment from 'moment';
import ProductModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';

export default class LCERRealm extends Realm.Object {

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
    const stage1 = (this.targetSpecies && this.numberOfHooks && this.locationStart && this.RAStart_date);
    if((!this.RAEnd_date && stage1)) {
      return stage1;
    }
    return !!(stage1 && (this.RAStart_date < this.RAEnd_date) && this.locationEnd && this.averageSpeed);
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

  get replicatedEstimatedCatch() {
    if(!this.estimatedCatch) {
      return [];
    }
    return this.estimatedCatch.map(
      c => Object.assign({}, blankModel(ProductModel), { code: c.code, amount: 0, RAId: uuid() }));
  }

  get nonFishProtectedsExist() {
    return !!this.protecteds.length;
  }

  canDelete() {
    return !this.completed;
  }

}
