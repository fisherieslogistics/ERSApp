
import ProductModel, { DiscardModel } from '../../models/ProductModel';
import ProtectedModel from '../../models/ProtectedModel';
import { blankModel } from '../../utils/ModelUtils';
import Pouch from '../../database/Pouch';

let db = null;

export const initialize = async (token) => {

  return async (dispatch) => {
    db = new Pouch(dispatch, token);
    db.setupSync(token);
    await db.setupMasterData();
    await db.setupReduxState();
    dispatch({ type: 'setDatabase', payload: { db }});
  }

}
