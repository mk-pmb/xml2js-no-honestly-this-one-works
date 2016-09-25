/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, obut = require('./obj-util.js'), ignVar = Boolean.bind(null, false),
  noFun = require('./nodefuncs.js');


EX = function compact(parentEasyNode, verboseElem) {
  var easyNode, popProp = obut.popProp.bind(null, verboseElem),
    nodeType = (verboseElem && typeof verboseElem);
  switch (nodeType) {
  case '':
  case 'string':
    return verboseElem;
  case 'object':
    nodeType = popProp('type');
    break;
  default:
    nodeType = 'JStype:' + nodeType;
    break;
  }
  if (parentEasyNode) {
    if (parentEasyNode.self() !== parentEasyNode) {
      throw new Error('Broken parent node self-ref!');
    }
  } else {
    if (nodeType === undefined) {
      nodeType = 'probablyRootElement';
      if (verboseElem.name === undefined) { verboseElem.name = '<<root>>'; }
    }
  }
  switch (nodeType) {
  case 'element':
  case 'probablyRootElement':
    easyNode = EX.makeSimpleNode(parentEasyNode, popProp('name', false),
      popProp('attributes', false), popProp('elements'));
    EX.transformDeclarations(popProp('declaration'), easyNode);
    break;
  case 'text':
    easyNode = popProp('text');
    break;
  case 'cdata':
    easyNode = EX.makeSimpleNode(parentEasyNode, '![CDATA[',
      null, [ popProp('cdata') ]);
    break;
  case 'comment':
    easyNode = EX.makeSimpleNode(parentEasyNode, '!--',
      { '!': popProp('comment') });
    easyNode.cmt = easyNode[0]['!'];
    break;
  }
  if (easyNode === undefined) {
    console.error({ unsupportedNode: verboseElem, type: nodeType });
    throw new Error('unsupported node type: ' + String(nodeType)
      + ', parent node: ' + parentEasyNode);
  }
  obut.expectEmptyObj(verboseElem);
  return easyNode;
};


EX.makeSimpleNode = function (parentEasyNode, tagName, attrs, children) {
  var easyNode = [];
  easyNode.tagName = tagName;
  easyNode.attrib = attrs;
  obut.objMap(attrs, function (v, k) { easyNode[k + '='] = v; });
  easyNode.self = Object.bind(null, easyNode);
  easyNode.parent = ((parentEasyNode && parentEasyNode.self) || false);
  Object.assign(easyNode, noFun);
  easyNode.push(Object.assign({ '': easyNode.tagName, }, attrs));
  if (children) {
    children.forEach(function (child, idx) {
      child = EX(easyNode, child);
      if (Array.isArray(child)) { child.idx = idx; }
      easyNode.push(child);
    });
  }
  return easyNode;
};


EX.transformDeclarations = function (verboseDecl, easyNode) {
  if (!verboseDecl) { return; }
  var attrib = obut.popProp(verboseDecl, 'attributes', false);
  // easyNode.decl = easyNode[0]['?'] = attrib;
  ignVar(attrib, '<-- just fake data anyway');
  obut.expectEmptyObj(verboseDecl);
  return easyNode;
};














module.exports = EX;
