'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('from Method', () => {

  it('static .from(stream) should create a readable stream with the same values', (done) => {
    const values = []
    const numbers = numberStream(4)
    const expected = [0, 1, 2, 3]
    const stream = Stream.from(numbers)

    expect(numbers === stream).toEqual(true)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

  it('static .from(Array) should create a readable stream with the same values', (done) => {
    const values = []
    const src = [1, 2, 3]
    const stream = Stream.from(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(src).toEqual(values)
      done()
    })
  })
})
