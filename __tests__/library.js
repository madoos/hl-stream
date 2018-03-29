'use strict'

const library = require('../')

describe('Import library', () => {
  it('Import Library Should to be a function', () => {
    expect(typeof library).toEqual('function')
  })
})
