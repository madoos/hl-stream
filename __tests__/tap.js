'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')

describe('.tap Method', () => {

  it('static .tap should apply bypass fn for each item', (done) => {
    let isTapped = false
    let times = 0
    const expected = [0, 1, 2]
    const results = []

    const tappedStream = Stream.tap(
      (data) => {
        times++
        isTapped = true
      },
      numberStream(3)
    )

    expect(tappedStream).isTransformStream()

    tappedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      expect(times).toEqual(3)
      expect(isTapped).toEqual(true)
      done()
    })
  })

  it('.tap should apply bypass fn for each item', (done) => {
    let isTapped = false
    let times = 0
    const results = []
    const expected = [0, 1, 2]
    const numbers = numberStream(3)
    const wrappedStream = Stream(numbers)

    const tappedStream = wrappedStream.tap( (data) => {
      times++
      isTapped = true
    })

    expect(tappedStream).isWrappedStream()
    const composedStream = tappedStream.get()
    expect(composedStream).isTransformStream()

    composedStream
    .on('data', (n) => results.push(n))
    .on('end', () => {
      expect(results).toEqual(expected)
      expect(times).toEqual(3)
      expect(isTapped).toEqual(true)
      done()
    })
  })

})
