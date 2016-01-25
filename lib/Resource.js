'use strict'

var icns = require('./icns')
var resources = require('./resources.json')

const PNG_FILE_SIGNATURE = '89504e470d0a1a0a'
const JPEG_FILE_SIGNATURE = 'ffD8ff'

function Resource (buffer, type, offset, length) {
  this.buffer = buffer
  this.type = type
  this.offset = offset
  this.length = length
  this.size = resources[type].size
}

Resource.prototype.base64 = function () {
  return this.read().toString('base64')
}

Resource.prototype.toString = function (encoding) {
  return this.read().toString(encoding)
}

Resource.prototype.dataURI = function () {
  return 'data:' + this.mimetype() + ',base64,' + this.base64()
}

Resource.prototype.mimetype = function () {
  if (!this.isModern()) return ''
  if (this.isPNG()) return '.png'
  else if (this.isJPEG()) return '.jpeg'
  else return ''
}

Resource.prototype.extname = function () {
  switch (this.mimetype()) {
    case 'image/png':
      return '.png'
    case 'image/jpeg':
      return '.jpeg'
    default:
      return ''
  }
}

Resource.prototype.isImage = function () {
  return resources[this.type].size > 0
}

Resource.prototype.isPNG = function () {
  var resource = resources[this.type]
  if (!resource.modern) return false
  return this.read(0, 8).toString('hex') === PNG_FILE_SIGNATURE
}

Resource.prototype.isJPEG = function () {
  var resource = resources[this.type]
  if (!resource.modern) return false
  return this.read(0, 4).toString('hex') === JPEG_FILE_SIGNATURE
}

Resource.prototype.read = function (offset, length) {
  var start = this.offset
  if (typeof offset === 'number') start += offset

  var end = this.offset + this.length
  if (typeof length === 'number') end = this.offset + length

  return this.buffer.slice(start, end)
}

Resource.prototype.isModern = function () {
  return resources[this.type].modern === true
}

module.exports = Resource
