import moment from 'moment';

const initialState = {
  species: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateSpecies':
      return action.species;
    default:
      return state;
  }
};
