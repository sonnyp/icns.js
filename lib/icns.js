'use strict'

// references
// https://en.wikipedia.org/wiki/Apple_Icon_Image_format
// http://www.ezix.org/project/wiki/MacOSXIcons
// http://www.macdisk.com/maciconen.php

var trim = require('trim')

var MAGIC = 'icns'

function parseHeader (buf) {
  return {
    magic: buf.toString('ascii', 0, 4),
    length: buf.readUInt32BE(4)
  }
}

function parseIcon (buf, offset) {
  var icon = buf.slice(offset)
  var length = buf.readUInt32BE(4)
  var type = ''
  if (icon.toString('hex', 0, 8) === '89504e470d0a1a0a') type = 'png'
  else if (icon.toString('hex', 0, 3) === 'ffd8ff') type = 'jpeg'
  return {type: type, length: length}
}

function parseIcons (buf) {
  var result = []
  var icons = buf.slice(16)
  var offset = 0
  while (offset < buf.length) {
    var icon = parseIcon(icons, offset)
    offset += icon.length
    result.push(icon)
  }
  return result
}

function parseData (buf) {
  var data = buf.slice(8)
  var result = {
    type: trim(data.toString('ascii', 0, 4)),
    length: data.readUInt32BE(4)
  }

  result.icons = parseIcons(buf)

  return result
}

module.exports.parse = function parse (buffer) {
  var result = {}
  var header = parseHeader(buffer)
  result.header = header
  if (header.magic !== MAGIC) return result

  result.data = parseData(buffer)
  return result
}
