'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('.reduce Method', () => {

  it('static .reduce should emit a single value', (done) => {
    let result
    let times = 0
    const numbers = numberStream(5)
    const expected = 10
    const reduceStream = _.reduce(0, R.add, numbers)

    expect(reduceStream).isTransformStream()

    reduceStream
    .on('data', (value) => {
      times++
      result = value
      expect(value).toEqual(expected)
    })
    .on('end', () => {
      expect(times).toEqual(1)
      expect(result).toEqual(expected)
      done()
    })
  })

  it(' .reduce should emit a single value', (done) => {
    let result
    let times = 0
    const numbers = numberStream(5)
    const expected = 10
    const reduceStream = _(numbers).reduce(0, R.add)
    expect(reduceStream).isWrappedStream()

    const composedStream = reduceStream.get()

    composedStream
    .on('data', (value) => {
      times++
      result = value
      expect(value).toEqual(expected)
    })
    .on('end', () => {
      expect(times).toEqual(1)
      expect(result).toEqual(expected)
      done()
    })
  })

})
