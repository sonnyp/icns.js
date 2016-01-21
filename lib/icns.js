'use strict'

// references
// * https://en.wikipedia.org/wiki/Apple_Icon_Image_format
// * http://www.ezix.org/project/wiki/MacOSXIcons
// * http://www.macdisk.com/maciconen.php
// * http://icns.sourceforge.net/

// var PNG_OR_JPEG = ['icp4', 'icp5', 'icp6', 'ic07', 'ic08', 'ic09', 'ic10', 'ic11', 'ic12', 'ic13', 'ic14']
var MAGIC = 'icns'

function readTOC (buffer, offset, length) {
  buffer = buffer.slice(offset)
  offset = 0
  var result = []
  while (offset < length) {
    result.push(readHeader(buffer, offset))
    offset += 8
  }
  return result
}

function readHeader (buf, offset) {
  return [
    // type
    buf.toString('ascii', offset, offset + 4),
    // length
    buf.readUInt32BE(offset + 4)
  ]
}

// function parseIcon (buf, offset) {
//   var icon = buf.slice(offset)
//   var length = buf.readUInt32BE(4)
//   var type = ''
//   if (icon.toString('hex', 0, 8) === '89504e470d0a1a0a') type = 'png'
//   else if (icon.toString('hex', 0, 3) === 'ffd8ff') type = 'jpeg'
//   return {type: type, length: length}
// }

function parseFoo (buf, offset) {
  var header = readHeader(buf, offset)
  return {
    type: header[0],
    length: header[1] - 8,
    offset: offset + 8
  }
}

function parseData (buf) {
  var result = []
  var offset = 8
  while (offset < buf.length) {
    var icon = parseFoo(buf, offset)
    offset += icon.length
    result.push(icon)
  }
  return result
}

module.exports.parse = function parse (buffer) {
  var result = {}
  var header = readHeader(buffer, 0)

  result.icns = header[0] === MAGIC
  result.length = header[1]

  result.data = parseData(buffer)
  result.data.forEach(function (data) {
    if (data.type === 'TOC ') {
      data.value = readTOC(buffer, data.offset, data.length)
    }
  })
  return result
}
