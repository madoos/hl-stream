'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')

describe('.wrap Method', () => {

  it('static .wrap should return a wrapped stream', () => {
    const wrappedStream = Stream.wrap(numberStream(3))
    expect(wrappedStream).isWrappedStream()
  })

})
