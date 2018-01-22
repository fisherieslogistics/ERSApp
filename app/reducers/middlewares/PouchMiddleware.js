
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';
import { blankModel } from '../../utils/ModelUtils';
import Pouch from '../../database/Pouch';

let db = null;

export const initialize = async (token) => {

  return async (dispatch) => {
    db = new Pouch(dispatch, token);
    const g = db.setupSync(token);
    await db.get('AppState')
      .then(db.setupReduxState)
      .catch(db.setupInitialTrip);
    await db.setupMasterData();
    dispatch({ type: 'setDatabase', payload: { db }});
  }

}
