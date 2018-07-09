'use strict';

export function setSuggestSearchTerm(text) {
  return {
    type: 'setSuggestSearchTerm',
    payload: {
      text,
    },
  };
}


export function setSuggestBarValue(value) {
  return {
    type: 'setSuggestBarValue',
    payload: {
      value,
    },
  };
}

export function setSuggestChoices(choices) {
  return {
    type: 'setSuggestChoices',
    payload: {
      choices,
    },
  };
}

export function orientation(orientation){
  return {
    type: 'orientation',
    payload: {
      orientation,
    },
  };
}

export function toggleSuggestBar(visible, inputId) {
  return {
    type: 'toggleSuggestBar',
    payload: {
      changes: {
        visible,
        inputId,
      },
    },
  };
}

export function setFocusedInputId(inputId) {
  return {
    type: 'setFocusedInputId',
    payload: {
      inputId,
    },
  };
}

export function setSelectedTab(tab) {
  return {
    type: 'setSelectedTab',
    payload: {
      tab,
    },
  };
}

export function setSelectedFishingDetail(name) {
  return {
    type: 'setSelectedFishingDetail',
    payload: {
      name,
    },
  };
}


export function hideLocationEditor() {
  return {
    type: 'hideLocationEditor',
    payload: { },
  };
}

export function showLocationEditor() {
  return {
    type: 'showLocationEditor',
    payload: { },
  };
}

export function setShowFormHistory(showing) {
  return {
    type: 'setShowFormHistory',
    payload: {
      showFormHistory: showing,
    },
  };
}
