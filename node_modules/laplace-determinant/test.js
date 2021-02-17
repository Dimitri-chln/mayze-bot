/* eslint-disable indent */

var det = require('laplace-determinant')
var test = require('tape')

test('Basic usage', function (t) {
  t.plan(6)

  // order = 1

  t.equal(det([10]), 10)

  // order = 2

  t.equal(det([1, 0,
               0, 1]), 1)

  t.equal(det([1, 1,
               2, 1]), -1)

  // order = 3

  t.equal(det([1, 0, 0,
               0, 1, 0,
               0, 0, 1]), 1)

  t.equal(det([0, 1, 0,
               2, -1, 0,
               0, 2, 1]), -2)

  // order = 4

  t.equal(det([1, 0, 0, 0,
               0, 1, 0, 0,
               0, 0, 1, 0,
               0, 0, 0, 1]), 1)
})

test('Custom field with Boolean algebra', function (t) {
  t.plan(1)

  var boole = {
    addition: function (a, b) { return a && b },
    multiplication: function (a, b) { return a || b },
    negation: function (a) { return !a }
  }

  t.equal(det([true, false,
               false, true], boole), true)
})
