
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';
import { blankModel } from '../../utils/ModelUtils';
import Pouch from '../../database/Pouch';

const update = (obj, chn) => Object.assign({}, obj, chn);

let db = null;

export const initialize = () => {
  return (dispatch) => {
    db = new Pouch(dispatch);
    db.setupListeners();
    db.setupSync();
    db.get('AppState')
      .then(db.setupReduxState)
      .catch(db.setupInitialTrip);
    dispatch({ type: 'setDatabase', payload: { db }});
  }
}

