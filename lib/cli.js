/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

process.stdout.on('error', function muteStdoutPipeError(err) {
  if (err.code === 'EPIPE') { return; }
  if (err.errno === 'EPIPE') { return; }
  throw err;
});

var xml2js = require('../easy.js'), obut = require('./obj-util.js');

xml2js.parseFile(process.argv[2], function (err, data) {
  if (err) {
    console.error(err);
    return process.exit(2);
  }
  data = obut.compactJsonify(data);
  console.log(data);
});
