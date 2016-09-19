/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;


EX.asyncIfCb = function (data, cb) {
  return (((typeof cb) === 'function') ? cb(null, data) : data);
};













/*scroll*/
