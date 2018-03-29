'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)
const wrapStream = require('../')
const numberStream = require('../__mocks__/numbers')

describe('Import library', () => {
  it('Import Library Should to be a function', () => {
    expect(typeof wrapStream).toEqual('function')
  })

  it('To execute Library Should to be a wrapped stream', () => {
    expect(
      wrapStream(numberStream(5))
    ).isWrappedStream()
  })
})
