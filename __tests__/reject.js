'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')

describe('.reject Method', () => {

  it('static .reject should filter items', (done) => {
    const isPair = (n) => n % 2 === 0
    const expected = [1, 3, 5]
    const results = []
    const filterStream = Stream.reject(isPair, numberStream(7))

    expect(filterStream).isTransformStream()

    filterStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

  it('.reject should filter items', (done) => {
    const isOdd = (n) => n % 2 !== 0
    const expected = [0, 2, 4, 6]
    const results = []

    const filteredStream = Stream(numberStream(7)).reject(isOdd)
    expect(filteredStream).isWrappedStream()
    const composedStream = filteredStream.get()
    expect(composedStream).isTransformStream()

    composedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      done()
    })
  })

})
