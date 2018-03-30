'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const numberStream = require('../__mocks__/numbers')
const R = require('ramda')

describe('ReadableFrom Method', () => {

  it('static .ReadableFrom(stream) should return the same readable stream', (done) => {
    const values = []
    const numbers = numberStream(4)
    const expected = [0, 1, 2, 3]
    const stream = _.ReadableFrom(numbers)

    expect(numbers === stream).toEqual(true)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

  it('static .ReadableFrom(Array) should create a readable stream with the same values', (done) => {
    const values = []
    const src = [1, 2, 3]

    const stream = _.ReadableFrom(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(src).toEqual(values)
      done()
    })
  })

  it('static .ReadableFrom(GeneratorFunction) should create a readable stream with the same values', (done) => {
    const values = []
    const expected = [1, 2, 3]
    const src = function * () {
      yield 1
      yield 2
      yield 3
    }

    const stream = _.ReadableFrom(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

  it('static .ReadableFrom(Generator instance) should create a readable stream with the same values', (done) => {
    const values = []
    const expected = [1, 2, 3]
    const src = (function * () {
      yield 1
      yield 2
      yield 3
    })()

    const stream = _.ReadableFrom(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

  it('static .ReadableFrom(Set) should create a readable stream with the same values', (done) => {
    const values = []
    const expected = [1, 2, 3]
    const src = new Set([1, 2, 3])

    const stream = _.ReadableFrom(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

  it('static .ReadableFrom(Map) should create a readable stream with the same values', (done) => {
    const values = []
    const expected = [['0', 'foo'], [1, 'bar']]
    const src = new Map();
    src.set('0', 'foo')
    src.set(1, 'bar')

    const stream = _.ReadableFrom(src)
    expect(stream).isReadableStream()

    stream
    .on('data', (data) => values.push(data))
    .on('end', () => {
      expect(expected).toEqual(values)
      done()
    })
  })

})
