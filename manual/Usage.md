# Usage

There are two ways to use hl-stream, the first using the constructor that allows the chaining of functions and the second using the static functions that allow partial application.

## Using constructor

When using the constructor returns an instance of hl-stream, to get the node stream use the get method.

As input allows: Readable Stream, Generator Function, Array and Iterables.

```javascript

const _ = require('hl-stream')

_(function * naturals {
  let n = 0
  while(true) yield n++
})
.take(3)
.map((n) => n*2)
.get()
on('data', console.log) // => 0, 2, 4

```
## Using static functions

The static functions return a Readable Stream.

```javascript

const _ = require('hl-stream')

_.map((n) => n+1, [1, 2, 3]).on('data', console.log) // => 2, 3, 4

```
## Compose with partial application

To use composition use the .pipeline method, these method returns the composite function.

```javascript

const numbersStream = _.readableFrom([0, 1, 2, 3, 4, 5])
const takeTreeAndDouble = _.pipeline(_.take(3),_.map(double))

const stream = takeTreeAndDouble(numbersStream).on('data', console.log) // => 0, 2, 4

```
