var multiDimArrayIndex = require('multidim-array-index')
var test = require('tape')

var error = multiDimArrayIndex.error

var i3 = multiDimArrayIndex.bind(null, [3])
var i2x3 = multiDimArrayIndex.bind(null, [2, 3])
var i2x3x4 = multiDimArrayIndex.bind(null, [2, 3, 4])

test('1th-order', function (t) {
  t.plan(3)

  t.equal(i3([0]), 0)
  t.equal(i3([1]), 1)
  t.equal(i3([2]), 2)
})

test('2th-order', function (t) {
  t.plan(6)

  t.equal(i2x3([0, 0]), 0)
  t.equal(i2x3([0, 1]), 1)
  t.equal(i2x3([0, 2]), 2)
  t.equal(i2x3([1, 0]), 3)
  t.equal(i2x3([1, 1]), 4)
  t.equal(i2x3([1, 2]), 5)
})

test('3th-order', function (t) {
  t.plan(16)

  t.equal(i2x3x4([0, 0, 0]), 0)
  t.equal(i2x3x4([0, 0, 1]), 1)
  t.equal(i2x3x4([0, 0, 2]), 2)
  t.equal(i2x3x4([0, 0, 3]), 3)
  t.equal(i2x3x4([0, 1, 0]), 4)
  t.equal(i2x3x4([0, 1, 1]), 5)
  t.equal(i2x3x4([0, 1, 2]), 6)
  t.equal(i2x3x4([0, 1, 3]), 7)
  t.equal(i2x3x4([1, 0, 0]), 8)
  t.equal(i2x3x4([1, 0, 1]), 9)
  t.equal(i2x3x4([1, 0, 2]), 10)
  t.equal(i2x3x4([1, 0, 3]), 11)
  t.equal(i2x3x4([1, 1, 0]), 12)
  t.equal(i2x3x4([1, 1, 1]), 13)
  t.equal(i2x3x4([1, 1, 2]), 14)
  t.equal(i2x3x4([1, 1, 3]), 15)
})

test('Errors', function (t) {
  t.plan(2)

  t.throws(function () {
    i3([11])
  }, new RegExp(error.outOfBoundIndex))

  t.throws(function () {
    i2x3x4([2, 3, 5])
  }, new RegExp(error.outOfBoundIndex))
})
