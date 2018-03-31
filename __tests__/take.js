'use strict'

const matchers = require('../__mocks__/matchers')
expect.extend(matchers)

const _ = require('../')
const R = require('ramda')
const numberStream = require('../__mocks__/numbers')

describe('.take Method', () => {

  it('static .take should take n items', (done) => {
    const expected = [0, 1, 2]
    const results = []
    const srcStream = numberStream(20000)
    const treeItemsStream = _.take(3, srcStream)

    treeItemsStream
    .on('data', (value) => results.push(value))
    .on('end', () => {
      expect(results).toEqual(expected)
      expect(srcStream.destroyed).toEqual(true)
      done()
    })
  })

  it('static .take should take n items', (done) => {
    const expected = [0, 1, 2]
    const results = []
    const srcStream = numberStream(20000)
    const treeItemsStream = _(srcStream).take(3).get()

    treeItemsStream
    .on('data', (value) => results.push(value))
    .on('end', () => {
      expect(results).toEqual(expected)
      expect(srcStream.destroyed).toEqual(true)
      done()
    })
  })

  it('.take in composed chain should take n items', (done) => {
    const expected = [0, 1, 2]
    const results = []
    const srcStream = numberStream(20000)
    const takeTreeItems = _.pipeline(_.take(3), _.map(R.identity), _.map(R.identity))
    const treeItemsStream = takeTreeItems(srcStream)

    treeItemsStream
    .on('data', (value) => results.push(value))
    .on('end', () => {
      expect(results).toEqual(expected)
      expect(srcStream.destroyed).toEqual(true)
      done()
    })
  })

})
