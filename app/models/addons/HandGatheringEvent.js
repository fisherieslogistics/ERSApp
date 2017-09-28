
import moment from 'moment';
import uuid from 'uuid/v1';
import ProductModel from '../../models/ProductModel';
import { blankModel } from '../../utils/ModelUtils';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class HandGatheringEventHelper {

  constructor(fishingEvent) {
    this.fishingEvent = fishingEvent;
    console.log(fishingEvent);
    const eventSpecificDetails = JSON.parse(fishingEvent.eventSpecificDetails);
    this.eventSpecificKeys = Object.keys(fishingEvent.eventSpecificDetails);
    this.eventKeys = Object.keys(fishingEvent);
    Object.assign(this, fishingEvent);
    Object.assign(this, eventSpecificDetails);
  }
  
  setValue(change) {
    Object.assign(this.fishingEvent, change);
    Object.assign(this, change);
  }

  toCouchRecord() {
    const record = {};
    const eventSpecificDetails = {};
    this.eventKeys.forEach(k => {
      record[k] = this[k];
    });
    this.eventSpecificKeys.forEach(k => {
      eventSpecificDetails[k] = this[k];
    });
    record.eventSpecificDetails = JSON.stringify(eventSpecificDetails);
    return record;
  }

  get startDateMoment() {
    return moment(this.startTime);
  }

  get endDateMoment() {
    return moment(this.endTime);
  }

  get canEnd() {
    return !this.endTime;
  }

  get shouldAddEmptyCatch() {
    return !this.estimatedCatch.find(p => !p.code);
  }

  get detailsValid() {
    const {
      locationAtStart,
      startTime,
      endTime,
      locationEnd,
    } = this;

    const stage1 = (locationAtStart && startTime);
    if((!endTime && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(startTime < endTime);
    return !!(stage1 && locationEnd && datesSweet);
  }

  get canSubmit() {
    const {
      detailsValid,
      endTime,
      estimatedCatchValid,
    } = this;
    return !!(detailsValid && endTime && estimatedCatchValid)
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

  get locationAtStartDecimal() {
    return JSONPointToLocation(this.locationAtStart);
  }

    return JSONPointToLocation(this.locationEnd);
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

  get fishServeObject() {
    return {
      eventHeader: this.eventHeader,
      method: 'H',
      targetSpeciesCode: this.targetSpecies,
      mitigationDevicesUsed: [],
      startDateTime: this.startTime,
      locationAtStart: {
        "systemDateTime": this.locationAtStartDecimal.timestamp,
        "systemLocation": {
          longitude: this.locationAtStartDecimal.lon,
          latitude: this.locationAtStartDecimal.lat,
        },
        isManual: false,
      },
      numberOfPeople: this.numberOfPeople,
      finishDateTime: this.endTime,
      finishLocation: {
        "systemDateTime": this.locationEndDecimal.timestamp,
        "systemLocation": {
          longitude: this.locationEndDecimal.lon,
          latitude: this.locationEndDecimal.lat,
        },
        isManual: false
      },
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
    //const vessel = getLastRecord('vessel');
    return {
      eventID: this.RAId,
      vesselNumber: 2,//vessel.registration,
      isVesselUsed: true,
      notes: 'Create By FLL Reporting',
    }
  }

}
