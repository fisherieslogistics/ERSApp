import FishingEventModel from '../models/FishingEventModel';
import TrawlEventModel from '../models/TrawlEventModel';
import Validator from './Validator';
import uuid from 'uuid/v1';


function attributeShouldRender(attr) {
  return !!attr.display;
}

export function validateModel(model, obj) {
  return model.filter(f => !!f.valid).every(field => !!field.valid.func(obj[field.id], obj));
}

export function shouldCollapseDepthFields({ bottomDepth, groundropeDepth }) {
  const bottomDepthValid = Validator.valid.greaterThanZero.func(bottomDepth);
  const groundropeDepthValid = Validator.valid.greaterThanZero.func(groundropeDepth);
  const bothValid = bottomDepthValid && groundropeDepthValid;
  const bothEqual = bottomDepth === groundropeDepth;
  return bothValid && bothEqual;
}

export function blankModel(model) {
  const blank = {};
  model.forEach(attribute => {
    blank[attribute.id] = attribute.default;
  });
  blank._id = uuid();
  blank.id = blank._id;
  return blank;
}

export function getFishingEventModel(){
  return FishingEventModel.concat(TrawlEventModel);
}

export function getRenderableAttributes(model) {
  return model.filter(attributeShouldRender);
}

export function getRenderableTrawlEventDetailModel(fishingEvent, showOptionalFields) {
  let model = [...FishingEventModel];

  // filter out non display and If not hauled, filter out haul fields
  if(!fishingEvent.datetimeAtEnd){
    model = model.filter(field => field.display && field.displayStage !== 'Haul');
  }

  if(showOptionalFields) {
    return model;
  }

  //If not showOptionalFields, filter out optional fields.  Only if the event is valid to
  model = model.filter(a => !a.optionalRender);
  // Filter out groundrope depth if shouldCombineDepths and change the label for bottomDepth
  if(!shouldCollapseDepthFields(fishingEvent)) {
    return model;
  }
  return model.filter(field => field.id !== 'groundropeDepth').map(
    (x) => {
      if (x.id === 'bottomDepth') {
        x.label = 'Bottom / Groundrope Depth';
      }
      return x;
    });
}
