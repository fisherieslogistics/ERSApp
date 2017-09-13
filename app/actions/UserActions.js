

export function updateUser(user) {
  return {
    type: 'updateUser',
    payload: {
      changes: user,
    },
  };
}

export function updateVessel(key, value, vessel) {
  return {
    type: 'updateVessel',
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
