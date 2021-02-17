function indicesPermutations (accumulator, currentValue, index, array) {
  const arrayLength = array.length
  const result = []

  if (arrayLength === 1) {
    for (let i = 0; i < currentValue; i++) {
      result.push([i])
    }
  } else {
    const arrayWithoutLastElement = array.slice(0, arrayLength - 1)

    const previousIteration = arrayWithoutLastElement.reduce(indicesPermutations, [])

    for (let l = 0; l < previousIteration.length; l++) {
      for (let k = 0; k < currentValue; k++) {
        result.push(previousIteration[l].concat(k))
      }
    }
  }

  return result
}

module.exports = exports.default = indicesPermutations
