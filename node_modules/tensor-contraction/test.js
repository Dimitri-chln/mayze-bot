/* eslint-disable indent */

var tensorContraction = require('tensor-contraction')
var test = require('tape')

function addition (a, b) { return a + b }

var contraction = tensorContraction.bind(null, addition)

test('matrix trace', function (t) {
  t.plan(1)

  t.equal(contraction([0, 1], [3, 3], [1, 2, 3,
                                       4, 5, 6,
                                       7, 8, 9]), 15)
})

test('indices pair check', function (t) {
  t.plan(1)

  t.throws(function () {
    contraction([0, 1], [3, 2], [1, 2, 3,
                                 4, 5, 6])
  }, /Contraction indices does not have the same dimension: 0-th index = 3 but 1-th index = 2./)
})

test('order 3', function (test) {
  test.plan(3)

  var t = [[[0, 1], [2, 3]], [[4, 5], [6, 7]]]

  test.deepEqual(contraction([0, 2], [2, 2, 2], [t[0][0][0], t[0][0][1], t[0][1][0], t[0][1][1],
                                                 t[1][0][0], t[1][0][1], t[1][1][0], t[1][1][1]]), [5, 9])

  test.deepEqual(contraction([0, 1], [2, 2, 2], [0, 1, 2, 3, 4, 5, 6, 7]), [6, 8])

  test.deepEqual(contraction([1, 2], [2, 2, 2], [0, 1, 2, 3, 4, 5, 6, 7]), [3, 11])
})
