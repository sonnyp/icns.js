'use strict'

var resources = require('./resources.json')

var TYPES = {}
Object.keys(resources).forEach(function (type) {
  TYPES[type.replace(/\W/g, '').toUpperCase()] = type
})

module.exports = TYPES
