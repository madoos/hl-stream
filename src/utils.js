'use strict'

const { Readable } = require('stream')
const R = require('ramda')

module.exports = {
  isStream,
  isWritableStream,
  isReadableStream,
  isDuplexStream,
  isTransformStream,
  isWrappedStream,
  streamFromIterator,
  isGeneratorFunction,
  isIterable,
  getIterator,
  streamFromGenerator,
  isFunction,
  takeFromReadable: R.curry(takeFromReadable)
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

function isGeneratorFunction (fn) {
  return fn != null && fn.constructor.name === 'GeneratorFunction'
}

function isIterable (obj) {
  return obj == null ? false : typeof obj[Symbol.iterator] === 'function'
}

function getIterator (src) {
  return src[Symbol.iterator]()
}

function streamFromIterator (iterator) {
  return new Readable({
    objectMode: true,
    read (data) {
      try {
        const { done, value } = iterator.next()
        !done ? this.push(value) : this.push(null)
      } catch (e) {
        this.emit('error', e)
      }
    }
  })
}

function streamFromGenerator (src) {
  return streamFromIterator(src())
}

function isFunction (fn) {
  return typeof fn === 'function'
}

function takeFromReadable (n, src, onTaken) {
  let times = 0
  const take = new Readable({ objectMode: true, read () {} })
  src.on('data', function (data) {
    if (times++ < n) {
      take.push(data)
    } else {
      take.push(null)
      onTaken()
    }
  })
  return take
}
