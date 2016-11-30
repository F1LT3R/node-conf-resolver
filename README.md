# Node Configuration Resolver

This is just a quick piece of code to demonstrate a way of resolving modules
in node projects from nested configuration files.

A configuration file declares the projects dependancies. Those files are then
required. Sometimes the dependancy is a node module. At other times the
dependancy is another configuration file, in which case the node module is
loaded from that sub-configuration file.

So modules can be included through configuration-file proxy `n` levels deep,
allowing users to employ either the individual modules, or app-stack from
another users node package, using their work as a graph node that allows
super-impossition of content and/or behavior.

```javascript
PARSE -> ./node-conf-resolver/conf.js
{
    "foo": "module-1",
    "bar": "module-1",
    "baz": "module-a"
}
foo
module-1
  PARSE -> ./node-conf-resolver/node_modules/module-1/conf.js
  {
      "foo": "module-2",
      "bar": "module-3"
  }
  foo
  module-2
    PARSE -> ./node-conf-resolver/node_modules/module-1/node_modules/module-2
    () => {
      console.log('this is module 2');
    }
  bar
  module-3
    PARSE -> ./node-conf-resolver/node_modules/module-1/node_modules/module-3
    () => {
      console.log('this is module 3');
    }
bar
module-1
  PARSE -> ./node-conf-resolver/node_modules/module-1/conf.js
  {
      "foo": "module-2",
      "bar": "module-3"
  }
  foo
  module-2
    PARSE -> ./node-conf-resolver/node_modules/module-1/node_modules/module-2
    () => {
      console.log('this is module 2');
    }
  bar
  module-3
    PARSE -> ./node-conf-resolver/node_modules/module-1/node_modules/module-3
    () => {
      console.log('this is module 3');
    }
baz
module-a
  PARSE -> ./node-conf-resolver/node_modules/module-a
  () => {
    console.log('this is module a');
  }

==========================================================
app: { foo: [Function], bar: [Function], baz: [Function] }
Parse calls: 8
app.foo()...
this is module 2
app.bar()...
this is module 3
app.baz()...
this is module a
```