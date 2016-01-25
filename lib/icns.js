'use strict'

// references
// * https://en.wikipedia.org/wiki/Apple_Icon_Image_format
// * http://www.ezix.org/project/wiki/MacOSXIcons
// * http://www.macdisk.com/maciconen.php
// * http://icns.sourceforge.net/

var TYPES = require('./types.js')
var resources = require('./resources.json')
var helpers = require('./helpers')
var readHeader = helpers.readHeader
var readTOC = helpers.readTOC

var MAGIC = 'icns'

function parseFoo (buf, offset) {
  var header = readHeader(buf, offset)
  return {
    type: header[0],
    length: header[1],
    offset: offset + 8
  }
}

function readData (buf) {
  var result = []
  var offset = 8
  while (offset < buf.length) {
    var icon = parseFoo(buf, offset)
    offset += icon.length
    result.push(icon)
  }
  return result
}

function readResources (buf) {
  var result = []
  var offset = 8
  while (offset < buf.length) {
    var icon = parseFoo(buf, offset)
    offset += icon.length
    result.push(icon)
  }
  return result
}

function getData (buf) {
  var result = []
  var offset = 8
  while (offset < buf.length) {
    var header = readHeader(buf, offset)
    result.push([header[0], offset + 8, header[1]])
    offset += header[1]
  }
  return result
}

function getTOC (buf) {
  var header = readHeader(buf, 8)
  if (header[0] !== TYPES.TOC) return null
  var TOC = readTOC(buf, 16, header[1] - 8)
  // calculate offset for each resource
  var p = 16 + header[1]
  return TOC.map(function (resource) {
    // type, offset, length
    var t = [resource[0], p, resource[1]]
    p += resource[1]
    return t
  })
}

function isIcns (buf) {
  return readHeader(buf, 0)[0] === MAGIC
}

/**
 * Returns the list of resources within the icon.
 * Use the table of content if available,
 * reads and parse the all buffer otherwise
 * @param  {Buffer} buf buffer
 * @return {Array}
 */
function getResources (buf) {
  return getTOC(buf) || getData(buf)
}

/**
 * Returns the list of images within the icon, that is the
 * list of resources with TOC and icnV resources filtered.
 * @param  {Buffer} buf buffer
 * @return {Array}
 */
function getImages (buf) {
  return getResources(buf).filter(function (resource) {
    switch (resource[0]) {
      case TYPES.TOC:
      case TYPES.ICNV:
        return false
      default:
        return true
    }
  })
}

function getModernImages (buf) {
  return getImages(buf).filter(function (image) {
    return resources[image[0]].modern
  })
}

function getBestModernImage (buf) {
  var best = null
  var images = getImages(buf)
  images.forEach(function (image) {
    var type = resources[image[0]]
    if (!type || !type.modern) return
    if (!best) best = image
    else if (type.size > resources[best[0]].size) best = image
  })
  return best
}

function parse (buffer) {
  var result = {}
  var header = readHeader(buffer, 0)

  result.icns = header[0] === MAGIC
  result.length = header[1]

  result.data = readData(buffer)
  result.data.forEach(function (data) {
    if (data.type === 'TOC ') {
      data.value = readTOC(buffer, data.offset, data.length)
    }
  })
  return result
}

module.exports.getImages = getImages
module.exports.getResources = getResources
module.exports.readResources = readResources
module.exports.getTOC = getTOC
module.exports.getData = getData
module.exports.getModernImages = getModernImages
module.exports.getBestModernImage = getBestModernImage
module.exports.isIcns = isIcns
module.exports.parse = parse
