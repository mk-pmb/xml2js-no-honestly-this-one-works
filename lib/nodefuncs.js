/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;

EX.at = function getAttribute(attrName, dflt) {
  return (attrName ? EX.getIfSet(this.attrib, attrName, dflt) : this.attrib);
};

EX.ch = function getChild(tagName, idx) {
  var childNodes = this.slice(1);
  switch (tagName && typeof tagName) {
  case undefined:
    return childNodes;
  case 0:
  case 'number':
    idx = tagName;
    break;
  case 'string':
    childNodes = childNodes.filter(function (cn) {
      return ((cn || false).tagName === tagName);
    });
    break;
  default:
    throw new Error('unsupported child spec: ' + String(tagName));
  }
  if (idx === undefined) { return childNodes; }
  idx %= childNodes.length;
  if (idx < 0) { idx += childNodes.length; }
  return childNodes[idx];
};






/*scroll*/
