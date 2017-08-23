

export function updateUser(key, value, user) {
  return {
    type: 'updateUser',
    realm: user,
    payload: {
      auth0ID: user.auth0ID,
      changes: {[key]: value },
    },
  };
}

export function updateVessel(key, value, vessel) {
  return {
    type: 'updateVessel',
    realm: vessel,
    payload: {
      changes: {[key]: value },
    }
  };
}

export function setSuggestResult(value) {
  return {
    type: 'setSuggestResult',
    payload: {
      value,
    }
  }
}

export function updateSuggestions(suggestions) {
  return {
    type: 'updateSuggestions',
    payload: {
      suggestions,
    }
  }
}
