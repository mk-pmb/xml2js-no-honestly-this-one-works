/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var xml2jsWorks = require('xml2js-no-honestly-this-one-works'),
  compactJson = require('ersatz-compactjson'),
  jsonOpts = { ersLW: require('ersatz-linewrap'),
    width: 70, unwrap: / {6,8}(?=")/ },
  D = require('../lib/demo-util-shim.js');

xml2jsWorks(require.resolve('./sched.xml'), function (err, data) {
  if (err) { return console.error(err); }
  console.log(compactJson(data, jsonOpts));
});

//= `[ { "": "<<root>>" },`
//= `  [ { "": "?xml", "version": "1.0" } ],`
//= `  [ { "": "?xml-stylesheet", "type": "text/xsl", "href": "base.xsl" } ],`
//= `  [ { "": "?xml-stylesheet", "href": "print.css",`
//= `    "media": "print", "title": "paper-friendly version",`
//= `    "alternate": "yes", "type": "text/css" } ],`
//= `  [ { "": "!DOCTYPE", "angle-brackets": [ true, true ], "inside": true },`
//= `    "<!ELEMENT p (#PCDATA)>" ],`
//= `  [ { "": "schedule", "data-venue": "Kitchen" },`
//= `    [ { "": "h2", "class": "day" }, "Monday" ],`
//= `    [ { "": "p", "class": "time-slot" }, "Noon:" ],`
//= `    [ { "": "h2", "class": "talk" }, "Bread" ],`
//= `    [ { "": "p", "class": "time-slot" }, "Evening:" ],`
//= `    [ { "": "h1", "class": "talk main-event" }, "\nB",`
//= `      [ { "": "![CDATA[" }, "r" ], "o",`
//= `      [ { "": "!--", "!": "\n    " } ], "wn",`
//= `      [ { "": "![CDATA[" }, "ie" ], "s",`
//= `      [ { "": "!--", "!": "\n    " } ] ],`
//= `    [ { "": "p", "class": "time-slot" }, "Night:" ],`
//= `    [ { "": "h2", "class": "talk" }, "Leftovers" ] ] ]`












/*scroll*/
