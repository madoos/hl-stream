'use strict'

const Stream = require('./src/Stream')

module.exports = Stream._exposeMethods(function hlStream (src, ...args) {
  return new Stream(src, ...args)
})
