'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')

describe('.batch Method', () => {

  it('static .batch should create a bash of items', (done) => {
    const numbers = numberStream(8)
    const expected = [[0, 1, 2], [3, 4, 5], [6, 7]]
    const results = []
    const batchStream = Stream.batch(3, numbers)
    expect(batchStream).isTransformStream()

    batchStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

  it('.batch should create a bash of items', (done) => {
    const numbers = numberStream(2)
    const expected = [[0, 1]]
    const results = []

    const batchStream = Stream(numbers).batch(2)
    expect(batchStream).isWrappedStream()
    const composedStream = batchStream.get()
    expect(composedStream).isTransformStream()

    composedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

})
