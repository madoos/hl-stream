'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const numberStream = require('../__mocks__/numbers')
const isPromise = (obj) => Promise.resolve(obj) === obj

describe('.toPromise Method', () => {

  it('static .toPromise should transform a single value to promise', () => {
    const numbers = numberStream(1)
    const expected = 0
    const result = _.toPromise(Promise, numbers)
    expect(isPromise(result)).toEqual(true)
    return result.then(data => expect(data).toEqual(expected))
  })

  it('.toPromise should transform a single value to promise', () => {
    const expected = 10
    const result = _([expected]).toPromise(Promise)
    expect(isPromise(result)).toEqual(true)
    return result.then(data => expect(data).toEqual(expected))
  })

})
