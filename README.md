
<!--#echo json="package.json" key="name" underline="=" -->
xml2js-no-honestly-this-one-works
=================================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
The 9004th XML reader module on npm, and this one actually works, honestly!
<!--/#echo -->



Motivation
----------

So why make yet another module for reading XML? Because `xml-js`
currently offers just two verbosity levels:
  * `{ compact: true }`: Discards useful information, e.g. order of elements.
  * `{ compact: false }`: Hides your information in elaborate verbosity.
  * See [doc/why.demo.js](doc/why.demo.js) for details.


Usage
-----
see [doc/demo/usage.js](doc/demo/usage.js)
:TODO:

```bash
$ xml2js-no-honestly-this-one-works foo
bar
```

```javascript
var xml2js-no-honestly-this-one-works = require('xml2js-no-honestly-this-one-works');
D.result  = xml2js-no-honestly-this-one-works(null);
D.expect('===',           null);
```


<!--#toc stop="scan" -->


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
