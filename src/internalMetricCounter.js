const state = {};

const resetState = () => {
  Object.keys(state).forEach(key => {
    delete state[key]
  })
}

const labelsToKey = (labels) => {
  return Object.keys(labels).sort().map(k => `${k}:${labels[k]}`).join(',')
}

const getLabels = () => {
  return Object.keys(state).map(key => {
    return key.split(',').reduce((accumulator, currentValue) => {
      const labelAndValue = currentValue.split(':')
      accumulator[labelAndValue[0]] = labelAndValue[1]
      return accumulator
    }, {})
  })
}

const setValue = (labels, value) => {
  state[labelsToKey(labels)] = value
}

const getValue = (labels) => {
  return state[labelsToKey(labels)] || 0
};

const incrementValue = (labels, increment) => {
  let newCount = getValue(labels) + Math.abs(increment || 1);

  // reset
  if (newCount >= Number.MAX_SAFE_INTEGER) {
    newCount = 0;
  }

  return setValue(labels, newCount);
};

module.exports = {
  resetState: resetState,
  getLabels: getLabels,
  get: getValue,
  set: setValue,
  increment: incrementValue
};