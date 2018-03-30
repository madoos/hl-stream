[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

# hl-stream

High level streams library for Node js inspired by [highland](https://highlandjs.org/) and [ramda](http://ramdajs.com/).
The main focus is to provide a functional interface using the native Node streams.

## Getting Started

To install:

    npm i --save hl-stream

In your project:

``` javascript

const _ = require('hl-stream')
const R = require('ramda')
const numberStream = require('./some/readable/numbersStream')

_.(numberStream)
.map(R.add(1))
.map(R.multiply(2))
.filter(R.gt(20))
.reduce(0, R.add)
.get()
.on('data', console.log)

```

## License

MIT © [Maurice Domínguez](maurice.ronet.dominguez@gmail.com)

[npm-image]: https://badge.fury.io/js/hl-stream.svg
[npm-url]: https://npmjs.org/package/hl-stream
[travis-image]: https://travis-ci.org/madoos/hl-stream.svg?branch=develop
[travis-url]: https://travis-ci.org/madoos/hl-stream
[daviddm-image]: https://david-dm.org/madoos/hl-stream.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/madoos/hl-stream
[coveralls-image]: https://coveralls.io/repos/madoos/hl-stream/badge.svg
[coveralls-url]: https://coveralls.io/r/madoos/hl-stream

