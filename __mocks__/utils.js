'use strict'

module.exports = {
  delayCallback
}

function delayCallback (data, time, cb) {
  setTimeout(() => cb(null, data), time)
}
