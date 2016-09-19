/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var xml2js = require('xml-js').xml2js, fs = require('fs'),
  underscore = '_', D = { annot: console.log.bind(console, '#') },
  easy = require('../easy.js');

fs.readFile('sched.xml', 'utf-8', function (err, xml, obj) {
  if (err) { return console.error(err); }

  D.annot('compact=true: easy to get text of <h1>…');
  obj = xml2js(xml, { compact: true });
  console.dir(obj.schedule.h1[underscore + 'text']);
  //= `'Brownies'`

  D.annot('… but no way to determine which element preceeds it:');
  console.dir(obj.schedule, { depth: 1 });
  //= `{ _attributes: { 'data-venue': 'Saal 2' },`
  //= `  h2: [ [Object], [Object], [Object] ],`
  //= `  p: [ [Object], [Object], [Object] ],`
  //= `  h1: { _attributes: [Object], _text: 'Brownies' } }`

  console.log('');  //= ``

  D.annot('compact=false: reeaally verbose:');
  obj = xml2js(xml, { compact: false });
  console.dir({
    h1Text:   obj.elements[0].elements[4].elements[0].text,
    prevNode: obj.elements[0].elements[3],
  });
  //= `{ h1Text: 'Brownies',`
  //= `  prevNode: `
  //= `   { type: 'element',`
  //= `     name: 'p',`
  //= `     attributes: { class: 'time-slot' },`
  //= `     elements: [ [Object] ] } }`

  console.log('');  //= ``

  D.annot('easier:');
  obj = easy(xml);
  console.log(easy.objUtil.compactJsonify(obj));
  //= `[ { "": false,`
  //= `    "?": { "version": "1.0" } },`
  //= `  [ { "": "schedule" },`
  //= `    [ { "": "h2" }, "Monday" ],`
  //= `    [ { "": "p" }, "Noon:" ],`
  //= `    [ { "": "h2" }, "Bread" ],`
  //= `    [ { "": "p" }, "Evening:" ],`
  //= `    [ { "": "h1" }, "Brownies" ],`
  //= `    [ { "": "p" }, "Night:" ],`
  //= `    [ { "": "h2" }, "Leftovers" ] ] ]`

});
