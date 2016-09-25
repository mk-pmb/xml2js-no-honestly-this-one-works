/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var EX, fs = require('fs'), xml2js = require('xml-js').xml2js,
  xmlattrdict = require('xmlattrdict'),
  fnut = require('./lib/func-util.js'),
  obut = require('./lib/obj-util.js'),
  compactElem = require('./lib/compact-elem.js'),
  noFun = require('./lib/nodefuncs.js');


EX = function xml2js() { return EX.magic.apply(null, arguments); };
EX.nodeFuncs = noFun;
EX.objUtil = obut;
EX.funcUtil = fnut;
EX.compact = compactElem;


EX.magic = function (input, recv) {
  switch (input && typeof input) {
  case 'string':
    if (input.match(/^\uFEFF?\s*</)) { return EX.parseStr(input, recv); }
    // ^-- If your file name matches that RegExp, just prepend "./"
    return EX.parseFile(input, recv);
  case 'function':
    return EX.proxyErrDataCb(input);
  case 'object':
    if (input.type === 'element') {
      return fnut.asyncIfCb(EX.compact(input), recv);
    }
    break;
  }
  if (Buffer.isBuffer(input)) { return EX.parseStr(input, recv); }
  if (input) {
    if ((typeof input.then) === 'function') { return EX.fromThenable(input); }
  }
  throw new Error('Unsupported input type.' +
    ' Expected XML as string or Buffer, or filename as string.');
};


EX.proxyErrDataCb = function (cb) {
  return function (err, xml) {
    if (err) { return cb(err); }
    return EX.parseStr(xml, cb);
  };
};


EX.parseFile = function (filename, recv) {
  if ((typeof recv) !== 'function') {
    throw new Error('Refusing to fs.readFileSync(). Do that yourself.');
  }
  return fs.readFile(filename, null, EX.proxyErrDataCb(recv));
};


EX.fromThenable = function (srcThenable) {
  var ours = { result: null, onSuccess: [], onError: [] };
  ours.reject = function (err) {
    err = (err instanceof Error ? err : new Error(String(err)));
    ours.result = err;
    ours.onError.map(function (func) { setImmediate(func, err); });
  };
  ours.resolve = function (data) {
    try {
      data = EX.magic(data);
    } catch (magicErr) {
      return ours.reject(magicErr);
    }
    ours.result = data;
    ours.onSuccess.map(function (func) { setImmediate(func, data); });
  };
  srcThenable.then(ours.resolve, ours.reject);
  ours.then = function (onSuccess, onError) {
    if (ours.result) {
      return (ours.result instanceof Error ? onError(ours.result)
        : onSuccess(ours.result));
    }
    ours.onSuccess = ours.onSuccess.concat(onSuccess);
    ours.onError = ours.onError.concat(onError);
  };
  return ours;
};


EX.parseStr = function (xml, recv) {
  if (Buffer.isBuffer(xml)) {
    xml.firstTagEnd = xml.indexOf('>');
    if ((xml.firstTagEnd > 0) && (xml.firstTagEnd < 1024)) {
      xml.xmlDeclEncoding = (String(xml.slice(0, xml.firstTagEnd)
        ).match(/^\s*<\?xml(?=\s)[\S\s]*\sencoding="([\w\_]+)"[\S\s]*\?\>/
        ) || false)[1];
    }
    xml = xml.toString(xml.xmlDeclEncoding || 'UTF-8');
  }
  xml = String(xml);
  var decl = [], nxTag;
  decl.hadBom = false;
  if (xml[0] === '\uFEFF') {
    decl.hadBom = xml[0];
    xml = xml.slice(1);
  }
  decl.preserveLineNumbers = '';
  decl.raw = [];
  while (xml.match(/^\s*<[\?\!]/)) {
    nxTag = (xml.match(xmlattrdict.tagRgx.at0) || false)[0];
    if (!nxTag) { break; }
    xml = xml.slice(nxTag.length);
    decl.preserveLineNumbers += nxTag.replace(/[\S \t\r]+/g, '');
    decl.raw.push(nxTag);
    decl.push(xmlattrdict(nxTag.replace(/^\s+/, '')));
  }
  xml = '<?xml version="1.0"?>' + decl.preserveLineNumbers + xml;
  try {
    xml = xml2js(xml, { compact: false });
    xml = EX.compact(null, xml);
  } catch (parseErr) {
    if ((typeof recv) === 'function') { return recv(parseErr); }
    throw parseErr;
  }
  if (decl.length > 0) {
    xml.splice.apply(xml, [1, 0].concat(decl.map(function (d) {
      var tagName = obut.popProp(d, '', false),
        children = obut.popProp(d, '[]', []);
      return EX.compact.makeSimpleNode(xml, tagName, d, children);
    })));
  }
  return fnut.asyncIfCb(xml, recv);
};























module.exports = EX;
