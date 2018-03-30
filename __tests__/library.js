'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)
const _ = require('../')
const numberStream = require('../__mocks__/numbers')

describe('Import library', () => {
  it('Import Library Should to be a function', () => {
    expect(typeof _).toEqual('function')
  })

  it('To execute Library Should to be a wrapped stream', () => {
    expect(
      _(numberStream(5))
    ).isWrappedStream()
  })

  it('To execute with array Library Should to be a wrapped stream', () => {
    expect(
      _([1, 2, 3])
    ).isWrappedStream()
  })

  it('To execute with set Library Should to be a wrapped stream', () => {
    expect(
      _(new Set([1, 2, 3]))
    ).isWrappedStream()
  })

  it('To execute with generator function Library Should to be a wrapped stream', () => {
    expect(
      _(function * () { yield 1 })
    ).isWrappedStream()
  })

})
