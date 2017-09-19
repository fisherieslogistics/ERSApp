import Realm from 'realm';
import moment from 'moment';
import Validator from '../utils/Validator';
import generateRealmSchema from '../database/generateRealmSchema';
import FORM_TYPE from '../constants/MPIFormType';
import { update } from '../utils/Helper';

const TCERFields = [
  {
    id: 'id',
    default: null,
    realm: { type: 'string', optional: true },
  },
  {
    label: 'Wing Spread',
    id: 'wingSpread',
    valid: Validator.valid.greaterThanZero,
    type: 'number',
    display: { type: 'single' }, unit: 'm',
    realm: { type: 'int', default: 0, optional: true },
  },
  {
    label: 'Headline Height',
    id: 'headlineHeight',
    valid: Validator.valid.greaterThanZero,
    type: 'float', unit: 'm',
    display: { type: 'single'},
    realm: { type: 'float', default: 0, optional: true },
  },
]

const LCERFields = [
  {
    label: 'Hook Spacing',
    id: 'hookSpacing',
    valid: Validator.valid.greaterThanZero,
    type: 'float',
    display: { type: 'single' },
    realm: { type: 'float', optional: true, unit: 'm' },
  },
]

const TripModel = [
  {
   label: 'Sailing From',
   id: 'leavingPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
   realm: { type: 'string', optional: true },
  },
  {
   label: 'Expected Unload Port',
   id: 'endPort',
   valid: Validator.valid.anyValue,
   type: 'picker',
   display: { type: 'single'},
   realm: { type: 'string', optional: true },
  },
  {
   label: 'Sailing Date',
   id: 'RAStart_date',
   valid: Validator.valid.startTimeValid,
   type: 'datetime',
   realm: { type: 'date', optional: true },
  },
  {
   label: 'Estimated Days Left In Trip',
   id: 'RAEnd_date',
   valid: Validator.valid.tripDate,
   type: 'picker', unit: '',
   display: { type: 'single'},
   realm: { type: 'date', optional: true },
  },

  {
    id: 'started',
    default: false,
    valid: Validator.valid.alwaysValid,
    type: 'bool',
    realm: { type: 'bool', default: false, optional: true  },
  },
  {
    id: 'complete',
    default: false,
    valid: Validator.valid.alwaysValid,
    type: 'bool',
    realm: { type: 'bool', default: false, optional: true },
  },
  {
    id: 'fishingEvents',
    default: [],
    realm: { type: 'list', objectType: 'FishingEvent', default: [] },
  },
  {
    id: 'serverId',
    default: null,
    realm: { type: 'string', optional: true },
  },
];

let specificFields = [];

switch(FORM_TYPE) {
  case 'LCER':
    specificFields = LCERFields;
    break;
  case 'TCER':
    specificFields = TCERFields;
    break;
}

const model = TripModel.concat(specificFields);

const realmSchema = generateRealmSchema(model, 'Trip');

class TripRealm extends Realm.Object {

  get startDateMoment() {
    return moment(this.RAStart_date);
  }

  get endDateMoment() {
    return moment(this.RAEnd_date);
  }

  get lastEvent() {
    return [...this.fishingEvents].pop();
  }

  get canStartEvent() {
    if(!this.started) {
      return false;
    }
    if(!this.lastEvent){
      return true;
    }
    if(FORM_TYPE === 'LCER') {
      return true;
    }
    return !!this.lastEvent.RAEnd_date;
  }

  get canEndEvent() {
    if(!this.started) {
      return false;
    }
    if(!this.lastEvent){
      return false;
    }
    return this.lastEvent.canEnd;
  }

  get canStart() {
    return !this.started && this.leavingPort && this.endPort &&
           this.RAStart_date && this.RAEnd_date;
  }

  get canEnd() {
    return this.started && this.fishingEvents.every(fe => !!fe.completed);
  }
  
  get eventId() {
    return `${this.RAId}`;
  }

  startToJSON(vesselNumber, personInCharge, header, lat, lon) {
    
    const tripHeader = {
      eventId: this.eventId,
      tripId: this.RAId,
      completedDateTime: moment().format(),//2017-09-18T15:12:30+12:00,
      vesselNumber: vesselNumber,//44695,
    };
    const eventHeader = update(header, tripHeader);
    const fishServeData = {
      eventHeader,
      personInCharge,
      startLocation: {
        systemDateTime: moment(this.RAStart_date),
        systemLocation: {
          longitude: `${lon}`,
          latitude: `${lat}`,
        },
        manualDateTime: null,
        manualLocation: null
      }
    }
    const json = JSON.stringify(fishServeData);
    return { eventHeader, json }  
  }
  
  get fishServeHeadersJSON() {
    return JSON.stringify({
      'Accept': 'application/json',
      'Signature': null,
      'Content-Type': 'application/json',
    });
  }

}


TripRealm.schema = realmSchema;

export { TripRealm }

export default model
