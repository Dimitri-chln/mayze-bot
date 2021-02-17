/* eslint-disable indent */

const test = require('tape')
const matrixMultiplication = require('matrix-multiplication')

const error = matrixMultiplication.error

const mul = matrixMultiplication()(2)

test('square matrices 2x2', function (t) {
  t.plan(1)

  const leftMatrix = [2, 3,
                      1, 1]

  const rightMatrix = [0, 1,
                      -1, 0]

  const data = mul(leftMatrix, rightMatrix)

  t.deepEqual(data, [-3, 2,
                     -1, 1])
})

test('multiply 3x2 by 2x4', function (t) {
  t.plan(1)

  const matrix3x2 = [2, 3,
                     1, 1,
                     1, 1]

  const matrix2x4 = [0, 1, 1, 1,
                    -1, 0, 2, 3]

  t.deepEqual(mul(matrix3x2, matrix2x4), [-3, 2, 8, 11,
                                          -1, 1, 3, 4,
                                          -1, 1, 3, 4])
})

test('compatibility check', function (t) {
  t.plan(2)

  t.throws(function () {
    mul([1, 2, 3,
         4, 5, 6,
         7, 8, 9], [1, 2,
                    3, 4])
  }, new RegExp(error.leftMatrixNotCompatible))

  t.throws(function () {
    mul([1, 2,
         3, 4], [1, 2, 3,
                 4, 5, 6,
                 7, 8, 9])
  }, new RegExp(error.rightMatrixNotCompatible))
})

test('custom field', function (t) {
  t.plan(1)

  function booleanAdd (a, b) { return a || b }
  function booleanMul (a, b) { return a && b }

  const customOperators = {
    addition: booleanAdd,
    multiplication: booleanMul
  }

  const mulB = matrixMultiplication(customOperators)(3)

  const y = true
  const n = false

  const matrix = [n, y, n,
                  y, n, y,
                  n, y, n]

  const identity = [y, n, n,
                    n, y, n,
                    n, n, y]

  const data = mulB(matrix, identity)

  t.deepEqual(data, [n, y, n,
                     y, n, y,
                     n, y, n])
})
