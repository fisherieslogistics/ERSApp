
import speciesCodes from '../constants/species/speciesCodes';
import stateCodes from '../constants/species/stateCodes';
import protectedSpeciesCodes from '../constants/species/protectedSpeciesCodes';
import Strings from '../constants/Strings';

const strings = Strings.english.errors;

function isStateCode(value) {
  return stateCodes.indexOf(value.toUpperCase()) !== -1;
}

const orderedValid = (orderedAttributes, obj, func, type) => {
  let valid = true;
  for(let i = 0; i < orderedAttributes.length -1; i++){
    let current = obj[orderedAttributes[i]];
    let next = obj[orderedAttributes[i+1]];
    if(type === 'number' || type === 'float') {
      current = parseFloat(current);
      next = parseFloat(next);
    }
    if(!func(current, next)){
      valid = false;
    }
  }
  return valid;
}

export default {
  valid: {
    anyValue: {
      func: (val) => !!`${val}`,
      errorMessage: 'must be a value',
    },
    greaterThanZero: {
      func: (value) => (isNaN(value) === false) && value > 0,
      errorMessage: strings.generic.moreThanZero
    },
    notNegative: {
      func: (value) => (isNaN(value) === false) && value >= 0,
      errorMessage: strings.generic.notNegative,
    },
    number: {
      func: (value) => !!isNaN(value),
      errorMessage: "Value must be a number",
    },
    targetSpecies_id: {
      func: (value) => {
        if(!value){
          return false;
        }
        return speciesCodes.indexOf(value.toUpperCase()) !== -1;
      },
      errorMessage: strings.generic.invalidSpeciesCode
    },
    locationValid: {
      func: (value) => !!value,
      errorMessage: "location must be set",
    },
    protectedSpecies: {
      func: (value = "") => {
        if(!value || value.length === 0){
          return false;
        }
        return protectedSpeciesCodes.indexOf(value) !== -1;
      },
      errorMessage: 'Must have a species name',
    },
    productCode: {
      func: (value = "",  product, catches) => {
        return catches.every(c => speciesCodes.indexOf(c.species_id) !== -1);
      },
      errorMessage: 'All catches must have a species',
    },
    stateCode: {
      func: (value = "") => isStateCode(value),
      errorMessage: 'Must be a valid state code',
    },
    productWeight: {
      func:  (value = "",  product, catches) => {
        return catches.every(c => c.weight > 0);
      },
      errorMessage: strings.generic.moreThanZero,
    },
    alwaysValid: {
        func: () => true
    },
    date: {
      func: (val) => !(val && val.toString() !== 'Invalid Date'),
    },
    tripDate: {
      func: () => true,
    }
  },
  combined:{
    orderedLessThan: (orderedAttributes, obj, type) => orderedValid(
      orderedAttributes, obj, (current, next) => (current < next), type),

    orderedLessThanOrEqual: (orderedAttributes, obj, type) => orderedValid(
      orderedAttributes, obj, (current, next) => (current <= next), type),

    orderedGreaterThan: (orderedAttributes, obj, type) => orderedValid(
      orderedAttributes, obj, (current, next) => (current > next), type),

    orderedGreaterThanOrEqual: (orderedAttributes, obj, type) => orderedValid(
      orderedAttributes, obj, (current, next) => (current >= next), type),

    combinedCountGreaterThanZero: (orderedAttributes, obj) => {
      if (obj[orderedAttributes[0]] === '0'
      && obj[orderedAttributes[1]] === '0'
      && obj[orderedAttributes[2]] === '0') {
        return false;
      }
      return true;
    },
    codeIsTypeValid: (orderedAttributes, obj) => protectedSpeciesCodes[obj[orderedAttributes[1]].toLowerCase()]
        .indexOf(obj[orderedAttributes[0]].toUpperCase()) !== -1,

    validSpeciesAndState: (orderedAttributes, obj, { fishingEvent }) => {
      let valid = true;
      const usedSpeciesStateCodes = fishingEvent.estimatedCatch.map(
        (product) => `${product.species_id}${product.state}`);
      const speciesState = `${obj.species_id}${obj.state}`;
      if (usedSpeciesStateCodes.filter(code => code === speciesState).length > 1) {
        valid = false;
      }
      return valid;
    },
    datetimeAtStartValid: (orderedAttributes, obj) => {
      const timeStart = obj[orderedAttributes[0]];
      const timeEnd = obj[orderedAttributes[1]];

      if(!(timeEnd && timeStart)) {
        return true;
      } else if (timeEnd.isAfter(timeStart)) {
        return true;
      }
      return false;
    }
  }
};
