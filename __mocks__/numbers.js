'use strict'

const { Readable } = require('stream')

module.exports = function naturals (max) {
  let start = 0
  return new Readable({
    objectMode: true,
    read () {
      start < max ? this.push(start++) : this.push(null)
    }
  })
}
