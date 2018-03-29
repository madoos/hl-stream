'use strict'

const Stream = require('./src/Stream')

module.exports = function HlStream (src, ...args) {
  return new Stream(src, ...args)
}
