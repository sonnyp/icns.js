function readHeader (buf, offset) {
  return [
    // type
    buf.toString('ascii', offset, offset + 4),
    // length
    buf.readUInt32BE(offset + 4)
  ]
}

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

module.exports.readHeader = readHeader
module.exports.readTOC = readTOC
