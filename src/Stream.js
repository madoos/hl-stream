'use strict'

const Events = require('events')
const { Transform } = require('stream')
const R = require('ramda')
const U = require('./utils')

class Stream extends Events {
  constructor (src) {
    super()
    this._src = Stream.from(src)
    this._transformQueue = []
    this.__wrapped_stream__ = true
  }

  static _exposeMethod (name) {
    const fn = Stream.prototype[name]
    const arity = fn.length + 1
    Stream[name] = R.curryN(arity, (...args) => fn.apply(args.pop(), args))
  }

  static _exposeMethods () {
    ['map']
    .forEach(Stream._exposeMethod)
  }

  static from (src) {
    if (Array.isArray(src)) return U.streamFromIterator(src)
    else if (U.isStream(src)) return src
  }

  static pipeline (...transforms) {
    return (src) => transforms.reduce((src, transform) => transform(src), src)
  }

  _composePipeline () {
    this._src = this._transformQueue.reduce((src, transform) => src.pipe(transform), this._src)
    return this._src
  }

  pipe (transform) {
    this._transformQueue.push(transform)
    return this
  }

  get () {
    return this._composePipeline()
  }

  map (fn) {
    const map = new Transform({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true,
      transform (data, enc, done) {
        done(null, fn(data, enc))
      }
    })

    return this.pipe(map)
  }
}

Stream._exposeMethods()
module.exports = Stream
