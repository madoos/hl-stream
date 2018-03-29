'use strict'

const U = require('../src/utils')

module.exports = {
  isTransformStream,
  isWrappedStream,
  isReadableStream
}

function isTransformStream (received) {
  return U.isTransformStream(received)
          ? { message: () => `received is a transform stream`, pass: true }
          : { message: () => `received is not a transform stream`, pass: false }
}

function isWrappedStream (received) {
  return U.isWrappedStream(received)
          ? { message: () => `received is a wrapped stream`, pass: true }
          : { message: () => `received is not a wrapped stream`, pass: false }
}

function isReadableStream (received) {
  return U.isReadableStream(received)
  ? { message: () => `received is a readable stream`, pass: true }
  : { message: () => `received is not a readable stream`, pass: false }
}
