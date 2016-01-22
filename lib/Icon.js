'use strict'

var icns = require('./icns')

function Icon (buffer) {
  this.buffer = buffer
}

Icon.prototype.readResources = function () {
  return icns.readResources(this.buffer)
}

Icon.prototype.getTOC = function () {
  return icns.getTOC(this.buffer)
}

Icon.prototype.getBest = function () {
  return icns.getBest(this.buffer)
}

Icon.prototype.getResources = function () {
  return icns.getResources(this.buffer)
}

Icon.prototype.getData = function () {
  return icns.getData(this.buffer)
}

Icon.prototype.getImages = function () {
  return icns.getImages(this.buffer)
}

Icon.prototype.getModernImages = function () {
  return icns.getModernImages(this.buffer)
}

Icon.prototype.getBestModernImage = function () {
  return icns.getBestModernImage(this.buffer)
}

module.exports = Icon
