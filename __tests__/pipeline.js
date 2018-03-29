'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('pipeline Method', () => {

  it('static pipeline should compose a transform', (done) => {
    const { map, pipeline } = Stream
    const numbers = numberStream(3)
    const values = []
    const expected = [2, 4, 6]

    const adOneAndDouble = pipeline(
      map(R.add(1)),
      map(R.multiply(2))
    )

    expect(typeof adOneAndDouble).toEqual('function')
    const stream = adOneAndDouble(numbers)
    expect(stream).isTransformStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

})
