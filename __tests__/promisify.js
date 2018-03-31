'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const R = require('ramda')
const delayCallback = require('../__mocks__/utils').delayCallback

describe('.promisify Method', () => {

  it('static .promisify should  promisify a function', () => {
    const wrappedFn = _.promisify(delayCallback)
    expect(typeof wrappedFn === 'function').toEqual(true)

    const param = 1
    return wrappedFn(param, 100).then((data) => expect(data).toEqual(param))
  })
})
