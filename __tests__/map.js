'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../src/Stream')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('.map Method', () => {

  it('static .map should apply the fn for each item', (done) => {
    const expected = [1, 2, 3, 4, 5]
    const results = []
    const mappedStream = Stream.map(R.add(1), numberStream(5))

    expect(mappedStream).isTransformStream()

    mappedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

  it('.map should apply the fn for each item', (done) => {
    const results = []
    const double = R.multiply(2)
    const expected = [0, 2, 4, 6]
    const numbers = numberStream(4) // => 0, 1, 2, 3
    const wrappedStream = new Stream(numbers)
    const mappedStream = wrappedStream.map(double)
    const composedStream = mappedStream.get()

    expect(mappedStream).isWrappedStream()
    expect(composedStream).isTransformStream()

    composedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

})
