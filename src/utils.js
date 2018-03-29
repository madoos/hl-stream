'use strict'

const { Readable } = require('stream')

module.exports = {
  isStream,
  isWritableStream,
  isReadableStream,
  isDuplexStream,
  isTransformStream,
  isWrappedStream,
  streamFromIterator
}

function streamFromIterator (src) {
  return new Readable({
    objectMode: true,
    read () {
      for (let data of src) this.push(data)
      this.push(null)
    }
  })
}

function isStream (src) {
  return (
    src !== null &&
    typeof src === 'object' &&
    typeof src.pipe === 'function' &&
    typeof src.on === 'function'
  )
}

function isWritableStream (src) {
  return (
    isStream(src) &&
    src.writable !== false &&
    typeof src._write === 'function' &&
    typeof src._writableState === 'object'
  )
}

function isReadableStream (src) {
  return (
    isStream(src) &&
    src.readable !== false &&
    typeof src._read === 'function' &&
    typeof src._readableState === 'object'
  )
}

function isDuplexStream (src) {
  return isReadableStream(src) && isWritableStream(src)
}

function isTransformStream (src) {
  return (
    isDuplexStream(src) &&
    typeof src._transform === 'function' &&
    typeof src._transformState === 'object'
  )
}

function isWrappedStream (src) {
  return (
    src.__wrapped_stream__ &&
    Array.isArray(src._transformQueue) &&
    src._src
  )
}
