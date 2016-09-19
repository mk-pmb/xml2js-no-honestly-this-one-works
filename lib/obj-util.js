/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;


EX.objMap = function (obj, iter, dest) {
  if (!dest) { dest = {}; }
  if (!obj) { return dest; }
  Object.keys(obj).map(function (key) { dest[key] = iter(obj[key], key); });
  return dest;
};


EX.getIfSet = function (obj, key, dflt) {
  var val = obj[key];
  return (val === undefined ? dflt : val);
};


EX.popProp = function (obj, key, dflt) {
  dflt = EX.getIfSet(obj, key, dflt);
  delete obj[key];
  return dflt;
};


EX.expectEmptyObj = function (obj) {
  var props = Object.keys(obj);
  if (props.length === 0) { return obj; }
  throw new Error('unsupported properties: ' + props.join(', '));
};


EX.compactJsonify = (function () {
  var mergeSpace = function (match, firstGrp, lastGrp) {
    lastGrp = arguments[arguments.length - 3];
    if (firstGrp) { match = match.slice(firstGrp.length); }
    if (lastGrp) { match = match.slice(0, -lastGrp.length); }
    return (firstGrp + match.replace(/\s*\n\s*/g, ' ') + lastGrp);
  };
  return function compactJsonify(data) {
    return JSON.stringify(data, null, 2
      ).replace(/(^|\n\s*)((\[|\{)\s+)+"[\!#-\uFFFF]*":()/g, mergeSpace
      ).replace(/()\n\s+([\!-Z_-z][ -\uFFFF]*\n\s*(\]|\}))/g, mergeSpace
      ).replace(/()\n(\s*(\}|\]))+(,|$)/g, mergeSpace);
  };
}());










/*scroll*/
