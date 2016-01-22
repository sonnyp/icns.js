#!/usr/bin/env node

var icns = require('../index')
var fs = require('fs')
var path = process.argv.slice(2)[0]
if (!path) throw new Error('path missing')

var data = fs.readFileSync(path)
var icon = new icns.Icon(data)
console.log(icon.getResources())
