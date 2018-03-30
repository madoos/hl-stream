'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('_exposeMethods Method', () => {

  it('static methods should allow Arrays, iterables and generator functions', () => {

    const streamFromGen = _.map(R.add(1), function * () { yield 1 })
    const streamFromIterator = _.filter(R.gte(0), new Set([1]))
    const streamFromArray = _.reduce(0,R.add, [1, 2])

    const streamComposed = _.pipeline(
                            _.map(R.add(1)),
                            _.filter(R.gte(0))
                          )([1, 2])

    expect(streamFromGen).isTransformStream()
    expect(streamFromIterator).isTransformStream()
    expect(streamFromArray).isTransformStream()
    expect(streamComposed).isTransformStream()
  })
})
