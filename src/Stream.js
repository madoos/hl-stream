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

  static _exposeMethod (name, Target) {
    const fn = Stream.prototype[name]
    const arity = fn.length + 1
    Target[name] = R.curryN(arity, (...args) => fn.apply(args.pop(), args))
  }

  static _exposeStaticMethod (name, Target) {
    Target[name] = Stream[name]
  }

  static _exposeMethods (Target = Stream) {
    const omit = ['constructor', 'name', 'length', 'prototype', 'pipe', 'get']
    const notPublics = (method) => omit.includes(method) || method.includes('_')
    const getMethods = R.pipe(Object.getOwnPropertyNames, R.reject(notPublics))

    getMethods(Stream.prototype).forEach((name) => Stream._exposeMethod(name, Target))
    getMethods(Stream).forEach((name) => Stream._exposeStaticMethod(name, Target))

    return Target
  }

  static wrap (src, ...args) {
    return new Stream(src, ...args)
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
      transform (data, enc, done) {
        done(null, fn(data, enc))
      }
    })

    return this.pipe(map)
  }

  tap (fn) {
    return Stream.map(R.tap(fn), this)
  }

  filter (predicate) {
    const filter = new Transform({
      objectMode: true,
      transform (data, enc, next) {
        predicate(data) && this.push(data)
        next()
      }
    })

    return this.pipe(filter)
  }

  reject (predicate) {
    return Stream.filter(R.complement(predicate), this)
  }

  batch (size) {
    let dataBatch = []

    const batch = new Transform({
      objectMode: true,
      transform (data, enc, next) {
        dataBatch.push(data)

        if (dataBatch.length >= size) {
          this.push(dataBatch)
          dataBatch = []
        }
        next()
      },
      flush (done) {
        if (dataBatch.length) {
          this.push(dataBatch)
          dataBatch = []
        }
        done()
      }
    })

    return this.pipe(batch)
  }

  reduce (initial, fn) {
    let acc = initial
    const reduce = new Transform({
      objectMode: true,
      transform (data, enc, next) {
        acc = fn(acc, data)
        next()
      },
      flush (done) {
        this.push(acc)
        done()
      }
    })

    return this.pipe(reduce)
  }
}

Stream._exposeMethods()
module.exports = Stream
