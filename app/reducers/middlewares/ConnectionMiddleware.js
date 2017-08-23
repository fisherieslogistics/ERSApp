
export default function ConnectionMiddleware({ dispatch, getState }) {

  return (next) => (action) => {
    const state = next(action);
    const { connection } = getState();
    if(!connection.activeConnection.dispatch) {
      connection.activeConnection.setDispatch(dispatch);
    }
    return state;
  }
}
