
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';
import { blankModel } from '../../utils/ModelUtils';
import Pouch from '../../database/Pouch';

let db = null;

export const initialize = (token) => {
  return (dispatch) => {
    db = new Pouch(dispatch, token);
    console.log(db);
    const g = db.setupSync(token);
    console.log(g);
    db.get('AppState')
      .then(db.setupReduxState)
      .catch(db.setupInitialTrip);
    dispatch({ type: 'setDatabase', payload: { db }});
  }
}
