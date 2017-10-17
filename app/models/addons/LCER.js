import
import moment from 'moment';
import ProductModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';

export

  get datetimeAtStartMoment() {
    return moment(this.datetimeAtStart);
  }

  get datetimeAtEndMoment() {
    return moment(this.datetimeAtEnd);
  }

  get canEnd() {
    return !this.datetimeAtEnd;
  }

  get shouldAddEmptyCatch() {
    return !this.estimatedCatch.find(p => !p.code);
  }

  get detailsValid() {
    const stage1 = (this.targetSpecies && this.numberOfHooks && this.locationAtStart && this.datetimeAtStart);
    if((!this.datetimeAtEnd && stage1)) {
      return stage1;
    }
    return !!(stage1 && (this.datetimeAtStart < this.datetimeAtEnd) && this.locationAtEnd && this.averageSpeed);
  }

  get estimatedCatchValid() {
    const catchToCheck =  [ ...this.estimatedCatch];
    //last one is always a blank;
    catchToCheck.pop();
    return this.estimatedCatch.length && catchToCheck.every(ec => (ec.code && ec.weightKgs));
  }

  get discardsValid() {
    return !this.discards.length || [ ...this.discards ].every(ec => (ec.code && ec.weightKgs));
  }

  get protectedsValid() {
    return true;
  }

  get locationStartDecimal() {
    return JSONPointToLocation(this.locationStart);
  }

  get locationAtEndDecimal() {
    return JSONPointToLocation(this.locationAtEnd);
  }

  get nonFishProtectedsExist() {
    return !!this.protecteds.length;
  }

  canDelete() {
    return !this.completed;
  }

}
