'use strict'

var types = require('./types.json')

Object.keys(types).forEach(function (type) {
  module.exports[type.toUpperCase()] = type
})

module.exports.TOC = 'TOC '
module.exports.ICNV = 'icnV'
