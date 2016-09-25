/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var xml2js = require('xml-js').xml2js, fs = require('fs'),
  easy = require('../easy.js'), usc = '_',
  D = require('../lib/demo-util-shim.js');

fs.readFile(require.resolve('./sched.xml'), 'utf-8', function (err, xml) {
  if (err) { return console.error(err); }

  D.chap('xml2js, compact=true');
  D.annot('easy to get text of <h1>:');
  var obj = xml2js(xml, { compact: true }),
    h1 = obj.schedule.h1[usc + 'text'];
  console.dir({ h1Text: h1 });
  //= `{ h1Text: '\nB\no\nwn\ns' }`
  //    ^& ^C ^!- ^C
  D.annot();
  D.annot('Well, it *would* have been easy, if the file structure was simple.');
  D.annot('Observe the different kinds of newlines:');
  D.annot('   #1 represents a newline character (CharRef),');
  D.annot('   #2 and #4 each represent a CDATA section, whereas');
  D.annot('   #3 represents a comment. You might expect a 5th newline');
  D.annot('   for the comment behind the final "s", but it is omitted.');
  D.annot();

  D.annot('No way to determine which element preceeds that <h1>:');
  console.dir(obj.schedule, { depth: 1 });
  //= `{ _attributes: { 'data-venue': 'Kitchen' },`
  //= `  h2: [ [Object], [Object], [Object] ],`
  //= `  p: [ [Object], [Object], [Object] ],`
  //= `  h1: `
  //= `   { _attributes: [Object],`
  //= `     _text: '\nB\no\nwn\ns',`
  //= `     _cdata: 'r\nie',`
  //= `     _comment: '\n    \n\n    ' } }`
  D.annot('NB: In that _cdata property, both CDATAs are merged by');
  D.annot('    newline. I wonder how you discern literal newlines.');
  D.annot();

  D.annot('We can get details of the xml declaration…');
  console.dir(obj[usc + 'declaration'][usc + 'attributes']);
  //= `{ version: '1.0' }`
  D.annot("… but I've no idea how to retrieve the stylesheet type.");

  D.chap('xml2js, compact=false');
  obj = xml2js(xml, { compact: false });
  D.annot('reeaally verbose formulae in source:');
  h1 = obj.elements[0].elements[4].elements;
  console.dir({
    h1Text:   h1[0].text + h1[1].cdata + h1[2].text +
      // skip h1[3]: it's a comment
      h1[4].text + h1[5].cdata + h1[6].text,
    //= `{ h1Text: '\nBrownies',`
    h1Join:  h1.map(function (e) { return (e.text || e.cdata || ''); }
                    ).join(''),
    //= `  h1Join: '\nBrownies',`
    prevNode: obj.elements[0].elements[3],
    //= `  prevNode: `
    //= `   { type: 'element',`
    //= `     name: 'p',`
    //= `     attributes: { class: 'time-slot' },`
    //= `     elements: [ [Object] ] },`
    xmlDecl:  obj.declaration.attributes,
    //= `  xmlDecl: { version: '1.0' } }`
  });
  D.annot();
  D.annot('… and still no idea how to find the stylesheet type');

  D.chap('xml2js-no-honestly-this-one-works');
  obj = easy(xml);
  D.annot('easy to get text of <h1>, and its previous element:');
  h1 = obj.ch('schedule', 0).ch('h1', 0);
  console.dir({
    h1Text:   h1.tx(),
    prevElem: { asString:   String(h1.prevElem()),
                tagName:    h1.prevElem().tagName,
                className:  h1.prevElem()['class='],
                text:       h1.prevElem().tx(),
              },
    xmlDecl:  obj.ch('?xml', 0).attrib,
    xmlVer:   obj.ch('?xml', 0)['version='],
  });
  //= `{ h1Text: '\nBrownies',`
  //= `  prevElem: `
  //= `   { asString: '[XMLnode h2]',`
  //= `     tagName: 'h2',`
  //= `     className: 'talk',`
  //= `     text: 'Bread' },`
  //= `  xmlDecl: { version: '1.0' },`
  //= `  xmlVer: '1.0' }`

  D.annot('What stylesheets do we have?');
  console.dir({
    styleSheets:  obj.ch('?xml-stylesheet').attr('href'),
  });
  //= `{ styleSheets: [ 'base.xsl', 'print.css' ] }`
});











/*scroll*/
