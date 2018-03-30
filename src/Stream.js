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
/**
 *
 *
 * Return a new instance of WrappedStream.
 *
 * @static
 * @param {ReadableStream} src
 * @param {String|Array} args
 * @returns {WrappedStream} Wrapped Stream.
 * @memberof Stream
 * @example
 *
 * const wrappedStream = _.wrap(readableStream)
 * const result = wrappedStream.map(add(1)).reduce(0, add).toPromise(Promise)
 *
 */
  static wrap (src, ...args) {
    return new Stream(src, ...args)
  }
/**
 *
 * Create an new instance of ReadableStream.
 *
 * @static
 * @param {Array|Iterator|ReadableStream|Function} src
 * @returns {ReadableStream} It will emit all the data of src.
 * @memberof Stream
 * @example
 *
 * const readableStreamFromArray = _.from([1, 2, 3, 4]) // => 1, 2, 3, 4
 * const readableStreamGeneratorFunction = _.from(function * () { yield 2 }) // 2
 * const readableStreamFromIterator _.from(new Set(['value1', 'value2', 'value3'])) // => 'value1', 'value2', 'value3'
 */
  static from (src) {
    if (Array.isArray(src)) return U.streamFromIterator(src)
    else if (U.isStream(src)) return src
  }
/**
 *
 *
 * Creates a function that when executed returns a stream composed by the steps of the pipeline.
 *
 * @static
 * @param {...Function} transforms
 * @returns {Function} When is executed it returns a Transform Stream composed by the steps of the pipeline.
 * @memberof Stream
 * @example
 *
 * const addTwoAnFilterPairs = _.pipeline(
 *    _.map(add(2)),
 *    _.filter(pairs)
 * )
 *
 * addTwoAnFilterPairs(_.from([1, 2, 3, 4])) // => 4, 6
 *
 */
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
/**
 *
 * Returns the stream composed of the function chain.
 * The chaining of functions is lazy and is only done by calling the get method.
 *
 * @returns {TransformStream} The stream composed
 * @memberof Stream
 * @example
 *
 *  const stream = _([1, 2, 3, 4]).map(double).filter(isPair)
 *  stream.get() // => 2, 4, 6, 8
 *
 */
  get () {
    return this._composePipeline()
  }
/**
 *
 *
 * Creates a new Stream of transformed values by applying a function to each value from the source.
 *
 * @param {Function} fn
 * @returns {TransformStream}
 * @memberof Stream
 * @example
 *
 *  const double = (n) => n * 2
 * _([1, 2, 3, 4]).map(double) // => 2, 4, 6, 8
 *
 * // or
 *
 * _.map(double, _.from([1, 2, 3, 4])) // => 2, 4, 6, 8
 */
  map (fn) {
    const map = new Transform({
      objectMode: true,
      transform (data, enc, done) {
        done(null, fn(data, enc))
      }
    })

    return this.pipe(map)
  }
/**
 *
 * Runs the given function with the supplied object, then returns the object.
 *
 * @param {Function} fn
 * @memberof Stream
 * @example
 *
 * _([1, 2, 3, 4]).tap(console.log) // => 1, 2, 3, 4, in console 1, 2, 3, 4
 *
 * // or
 *
 * _.tap(console.log, from([1, 2, 3, 4])) // => 1, 2, 3, 4, in console 1, 2, 3, 4
 *
 */
  tap (fn) {
    return Stream.map(R.tap(fn), this)
  }
/**
 *
 * Takes a predicate and create a new stream with the members of the given filterable which satisfy the given predicate.
 *
 * @param {Function} predicate
 * @returns {TransformStream} Stream with the filtered objects.
 * @memberof Stream
 * @example
 *
 * const isPair = (n) => n % 2 === 0
 * _([1, 2, 3, 4]).filter(isPair)
 *
 * // or// => 2, 4
 *
 * _.filter(isPair, _.from([1, 2, 3, 4])) // => 2, 4
 *
 */
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
/**
 *
 * The complement of filter.
 * Removes every element in the stream that complies with the predicate
 *
 * @param {Function} predicate
 * @returns {TransformStream} Stream with not rejected items
 * @memberof Stream
 * @example
 *
 * const isPair = (n) => n % 2 === 0
 * _([1, 2, 3, 4]).reject(isPairs) // => 1, 3
 *
 * // Or
 *
 * _.filter(isPairs, _.from([1, 2, 3, 4])) // => 1, 3
 */
  reject (predicate) {
    return Stream.filter(R.complement(predicate), this)
  }
/**
 *
 *Takes one Stream and batches incoming data into arrays of given length.
 *
 * @param {Number} size
 * @returns {TransformStream}
 * @memberof Stream
 * @example
 *
 * _([1, 2, 3, 4, 5]).batch(2) // => [1, 2], [3, 4], [5]
 *
 * // or
 *
 * _.batch(2, _.from([1, 2, 3, 4, 5])) // => [1, 2], [3, 4], [5]
 */
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
/**
 *
 * Boils down a Stream to a single value.
 *
 * @param {any} initial
 * @param {Function} fn
 * @returns {TransformStream} Stream with the reduced value.
 * @memberof Stream
 * @example
 *
 * _([1, 2, 3, 4]).reduce(add) // => 10
 *
 * // or
 *
 * _.reduce(add, _.from([1, 2, 3, 4])) // => 10
 *
 */
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
/**
 *
 * Converts the result of a stream to Promise.
 * @param {Function} PromiseConstructor
 * @returns {Promise} result
 * @memberof Stream
 * @example
 *
 *
 * _([1, 2, 3, 4]).reduce(0, add).toPromise(Promise).then(function (result) {
 *   // parameter result will be 10
 *  })
 *
 * // or
 *
 * _.toPromise(Promise, _.from([1, 2, 3, 5])).then(function (result) {
 *   // parameter result will be 10
 *  })
 *
 */
  toPromise (PromiseConstructor) {
    const stream = this.__wrapped_stream__ ? this._composePipeline() : this
    return new PromiseConstructor((resolve, reject) => stream.on('data', resolve).on('error', reject))
  }
}

Stream._exposeMethods()
module.exports = Stream
