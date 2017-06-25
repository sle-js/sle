# sle

The sle (Simple Language Experiments) is a Node.js package that supports the building of applications without the need to have a concrete set of dependencies.  This is achieved by introducing the function

```javascript
  mrequire
```

which takes a single string parameter describing the file that is to be included.  The format of that parameter is

```javascript
  handler:package:version
```

