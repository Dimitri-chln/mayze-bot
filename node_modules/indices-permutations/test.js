var indicesPermutations = require('indices-permutations')
var test = require('tape')

test('order 1', function (t) {
  t.plan(1)

  t.deepEqual([5].reduce(indicesPermutations, []), [
    [0], [1], [2], [3], [4]
  ])
})

test('order 2', function (t) {
  t.plan(1)

  t.deepEqual([3, 3].reduce(indicesPermutations, []), [
    [0, 0], [0, 1], [0, 2],
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2]
  ])
})

test('order 3', function (t) {
  t.plan(1)

  t.deepEqual([2, 2, 3].reduce(indicesPermutations, []), [
    [0, 0, 0], [0, 0, 1], [0, 0, 2],
    [0, 1, 0], [0, 1, 1], [0, 1, 2],
    [1, 0, 0], [1, 0, 1], [1, 0, 2],
    [1, 1, 0], [1, 1, 1], [1, 1, 2]
  ])
})
