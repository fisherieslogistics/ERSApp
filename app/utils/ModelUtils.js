import FishingEventModel from '../models/FishingEventModel';
import TCERModel from '../models/TCERModel';
import Validator from './Validator';


function attributeShouldRender(attr) {
  return !!attr.display;
}

export function validateModel(model, obj) {
  return model.filter(f => !!f.valid).every(field => !!field.valid.func(obj[field.id], obj));
}

export function shouldCollapseDepthFields({ bottomDepthMetres, groundropeDepthMetres }) {
  const bottomDepthValid = Validator.valid.greaterThanZero.func(bottomDepthMetres);
  const groundropeDepthValid = Validator.valid.greaterThanZero.func(groundropeDepthMetres);
  const bothValid = bottomDepthValid && groundropeDepthValid;
  const bothEqual = bottomDepthMetres === groundropeDepthMetres;
  return bothValid && bothEqual;
}

export function blankModel(model) {
  const blankModel = {};
  model.forEach(attribute => {
    blankModel[attribute.id] = attribute.default;
  });
  return blankModel;
}

export function getFishingEventModel(){
  return FishingEventModel.concat(TCERModel);
}

export function getRenderableAttributes(model) {
  return model.filter(attributeShouldRender);
}

export function getRenderableTCERDetailModel(fishingEvent, showOptionalFields) {
  let model = [...FishingEventModel];

  // filter out non display and If not hauled, filter out haul fields
  if(!fishingEvent.RAEnd_date){
    model = model.filter(field => field.display && field.displayStage !== 'Haul');
  }

  if(showOptionalFields) {
    return model;
  }

  //If not showOptionalFields, filter out optional fields.  Only if the event is valid to
  model = model.filter(a => !a.optionalRender);
  // Filter out groundrope depth if shouldCombineDepths and change the label for bottomDepthMetres
  if(!shouldCollapseDepthFields(fishingEvent)) {
    return model;
  }
  return model.filter(field => field.id !== 'groundropeDepthMetres').map(
    (x) => {
      if (x.id === 'bottomDepthMetres') {
        x.label = 'Bottom / Groundrope Depth';
      }
      return x;
    });
}
