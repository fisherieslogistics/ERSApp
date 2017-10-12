import moment from 'moment';
import TrawlEventModel from '../../models/TrawlEventModel';
import FishingEventModel from '../../models/FishingEventModel';

import { blankModel } from '../../utils/ModelUtils';
import uuid from 'uuid/v1';
import JSONPointToLocation from '../../utils/JSONPointToLocation';


export default class TrawlEventHelper {
  
  constructor(trawlEvent) {
    Object.assign(this, trawlEvent);
  }

  datetimeAtStartMoment() {
    return moment(this.datetimeAtStart);
  }

  get datetimeAtEndMoment() {
    return moment(this.datetimeAtEnd);
  }

  get canEnd() {
    return !this.datetimeAtEnd;
  }

  get shouldAddEmptyCatch() {
    return false;
  }

  get detailsValid() {
    const {
      targetSpecies,
      wingSpread,
      headlineHeight,
      locationAtStart,
      datetimeAtStart,
      datetimeAtEnd,
      bottomDepth,
      groundropeDepth,
      averageSpeed,
      locationAtEnd,
    } = this;

    const stage1 = (targetSpecies && wingSpread && headlineHeight && locationAtStart && datetimeAtStart);
    if((!datetimeAtEnd && stage1)) {
      return stage1;
    }
    const datesSweet =  !!(datetimeAtStart < datetimeAtEnd);
    const depths = !!(bottomDepth && groundropeDepth);
    return !!(stage1 && !!locationAtEnd && !!averageSpeed && depths && datesSweet);
  }

  get canSubmit() {
    const {
      detailsValid,
      datetimeAtEnd,
      estimatedCatchValid,
    } = this;
    return !!(detailsValid && datetimeAtEnd && estimatedCatchValid)
  }

  get estimatedCatchKg() {
    return 0;
  }

  get estimatedCatchValid() {
    //const catchToCheck =  [ ...this.estimatedCatch];
    //last one is always a blank;
    return true;
    //catchToCheck.pop();
    //return this.estimatedCatch.length && catchToCheck.every(ec => (ec.code && ec.weightKgs));
  }

  get discardsValid() {
    return //!this.discards.length || [ ...this.discards ].every(ec => (ec.code && ec.weightKgs));
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

  get NetLeaveDepthLocationDecimal() {
    return JSONPointToLocation(this.NetLeaveDepthLocation);
  }

  get NetAtDepthLocationDecimal() {
    return JSONPointToLocation(this.NetAtDepthLocation);
  }

  get replicatedEstimatedCatch() {
    return [];
    if(!this.estimatedCatch) {
      return [];
    }
    return this.estimatedCatch.map(
      c => Object.assign({}, blankModel(ProductModel), { code: c.code, weightKgs: 0, RAId: uuid() }));
  }

  canDelete(latestInTrip) {
    return !this.completed && (this.numberInTrip === latestInTrip);
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
      startDateTime: this.datetimeAtStart,
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
      finishDateTime: this.datetimeAtEnd,
      finishLocation: {
        "systemDateTime": this.locationAtEndDecimal.timestamp,
        "systemLocation": {
          longitude: this.locationAtEndDecimal.lon,
          latitude: this.locationAtEndDecimal.lat,
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
        greenWeightEstimateKg: es.weightKgs,
      })),
      isNonFishOrProtectedSpeciesCatchPresent: this.nonFishProtected,
      nonFishOrProtectedSpeciesCatches: this.protecteds.map(pr => ({
        seabirdCaptureDetails: null,
        estimatedWeightKg: pr.weightKgs,
        numberUninjured: pr.uninjured,
        numberInjured: pr.injured,
        numberDead: pr.dead,
        tags: []
      })),
    }
  }
  
  fieldsToRender() {
    return FishingEventModel.concat(TrawlEventModel).filter(
      field => !!field.display);
  }

  get eventHeader() {
    //const vessel = getLastRecord('vessel');
    return {
      //eventID: this.RAId,
      //vesselNumber: vessel.registration,
      isVesselUsed: true,
      notes: 'Create By FLL Reporting',
    }
  }

}
