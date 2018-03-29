'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const Stream = require('../')
const numberStream = require('../__mocks__/numbers')
const isPromise = (obj) => Promise.resolve(obj) === obj

describe('.toPromise Method', () => {

  it('static .toPromise should transform a single value to promise', () => {
    const numbers = numberStream(1)
    const expected = 0
    const result = Stream.toPromise(Promise, numbers)
    expect(isPromise(result)).toEqual(true)
    return result.then(data => expect(data).toEqual(expected))
  })

  it('.toPromise should transform a single value to promise', () => {
    const expected = 10
    const result = Stream([expected]).toPromise(Promise)
    expect(isPromise(result)).toEqual(true)
    return result.then(data => expect(data).toEqual(expected))
  })

})
