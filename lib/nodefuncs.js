/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports, XmlAttrDictTag = require('xmlattrdict/xmltag');


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
  if (idx === undefined) { return EX.blessNodesList(childNodes); }
  idx %= childNodes.length;
  if (idx < 0) { idx += childNodes.length; }
  return childNodes[idx];
};


EX.tx = EX.innerText = function innerText() {
  return this.ch().map(function (ch) {
    if ((typeof ch) === 'string') { return ch; }
    return ch.innerText();
  }).join('');
};


EX.toString = function () {
  return '[XMLnode '.concat(this.tagName, ']');
  // XmlAttrDictTag.prototype.toString.call(this[0]);
};


EX.prevSib = function previousSibling(distance) {
  if (this.idx < 1) { return false; }
  if (!this.parent) { return false; }
  if (distance === undefined) { distance = 1; }
  var sibs = this.parent().ch().slice(0, this.idx - 1);
  if (distance === 0) { return EX.blessNodesList(sibs); }
  return (sibs[sibs.length - distance] || false);
};


EX.sibElem = function (opts) {
  opts = (opts || false);
  var sibs = (opts.forward ? this.nextSib(0) : this.prevSib(0)), elem,
    tags = (opts.tags || false), tagName;
  if (tags === true) {
    tags = { '!--': false,  '![CDATA[': false,
      'tex\t': false, 'othe\r': true };
  }
  while (prev.length > 0) {
    elem = prev.pop();
    tagName
    switch (((typeof elem.tagName) === 'string') && elem.tagName) {
    case false:
      break;
    default:
      return elem;
    }
  }
  return false;
};


EX.prevElem = function previousElementSibling() {
  return this.sibElem({ forward: false, tags: true });
};


EX.nextElem = function previousElementSibling() {
  return this.sibElem({ forward: true, tags: true });
};


EX.blessNodesList = function (arrayOfNodes) {
  return Object.assign(arrayOfNodes, EX.nodesListFuncs);
};


EX.attr = function (attrName, newVal) {
  var oldVal = this.attrib[attrName];
  if (newVal !== undefined) { this.attrib[attrName] = newVal; }
  return oldVal;
};


EX.nodesListFuncs = (function (nc) {

  nc.mapMthd = function (mthdName) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.map(function (el) { return el[mthdName].apply(el, args); });
  };

  nc.attr = function (attrName, newVal) {
    return this.mapMthd('attr', attrName, newVal);
  };

  return nc;
}({}));

















/*scroll*/
