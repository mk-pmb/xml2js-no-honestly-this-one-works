/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var EX, fs = require('fs'), xml2js = require('xml-js').xml2js,
  fnut = require('./lib/func-util'),
  obut = require('./lib/obj-util'),
  noFun = require('./lib/nodefuncs');


EX = function xml2js() { return EX.magic.apply(null, arguments); };
EX.nodeFuncs = noFun;
EX.objUtil = obut;
EX.funcUtil = fnut;


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
  if (Buffer.isBuffer(input)) {
    return EX.parseStr(input.toString('utf-8'), recv);
  }
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
  return fs.readFile(filename, 'UTF-8', EX.proxyErrDataCb(recv));
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
  if (Buffer.isBuffer(xml)) { xml = xml.toString('utf-8'); }
  try {
    xml = xml2js(xml, { compact: false });
    xml = EX.compact(xml);
  } catch (parseErr) {
    if ((typeof recv) === 'function') { return recv(parseErr); }
    throw parseErr;
  }
  return fnut.asyncIfCb(xml, recv);
};


EX.couldBeRootElem = function (x) {
  return (x && (x.type === undefined) && x.declaration
    && ((x.elements || false).length === 1)
    && ((x.elements[0] || false).type === 'element'));
};


EX.compact = function compact(verboseElem) {
  var easyNode, popProp = obut.popProp.bind(null, verboseElem),
    nodeType = popProp('type'), subElem = (nodeType === 'element'),
    maybeRoot = ((!subElem) && EX.couldBeRootElem(verboseElem)),
    parent;
  if (subElem || maybeRoot) {
    easyNode = [];
    easyNode.tagName = popProp('name', false);
    easyNode.attrib = popProp('attributes', false);
    obut.objMap(easyNode.at, function (v, k) { easyNode[k + '='] = v; });
    Object.assign(easyNode, EX.nodeFuncs);
    easyNode.push(Object.assign({ '': easyNode.tagName, }, easyNode.at));
    parent = Object.bind(null, easyNode);
    popProp('elements', []).forEach(function (child, idx) {
      child = compact(child);
      if (Array.isArray(child)) {
        child.idx = idx;
        child.parent = parent;
      }
      easyNode.push(child);
    });
    if (verboseElem.declaration) {
      easyNode.decl = easyNode[0]['?'] = obut.popProp(verboseElem.declaration,
        'attributes');
      obut.expectEmptyObj(popProp('declaration'));
    }
    obut.expectEmptyObj(verboseElem);
    return easyNode;
  }
  switch (nodeType) {
  case 'text':
    return verboseElem.text;
  case 'cdata':
    easyNode = [verboseElem.cdata];
    easyNode.tagName = '![CDATA[';
    return easyNode;
  }
  throw new Error('unsupported node type: ' + String(nodeType));
  // return verboseElem;
};



















module.exports = EX;
