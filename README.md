# sle

The sle (Simple Language Experiments) is a Node.js package that supports the building of applications without the need 
to have a concrete set of dependencies.  This is achieved by introducing the function

```javascript
  mrequire
```

which takes a single string parameter describing the package that is to be included.  The format of this parameter is

```javascript
  handler:package:version
```

* _handler_
 
  Within sle there are support for two different handlers: `core` and `github`.  The `core` handler will refer to a 
  package that is stored in 
  
  > `https://github.com/sle-js`
  
  whilst the `github` handler will refer to the package that is referenced by the entire package component.
  
* _package_

  The name of the package that the handler will reference.
  
* _version_

  The labelled name which is used as a version indicator for the required package.
   
   
## Core Example ##

Given the following piece of code:

```javascript
  const Array = mrequire("core:Native.Data.Array:1.0.0");
```

This will download the following project out of github located at
 
    https://github.com/sle-js/lib-Native.Data.Array
    
This source code will be placed into the directory

    ~/.sle/core/Native.Data.Array/1.0.0
    
off of the user's home directory.  Note that only the code against the label `1.0.0` will be placed into this directory.

Finally the file `index.js` is then returned as a `require` to the caller.


## Github Example ##

Given the following piece of code:

```javascript
  const Array = mrequire("github:graeme-lockley/mn-Native.Data.Array:1.0.0");
```

This will download the following project out of github located at
 
    https://github.com/graeme-lockley/mn-Native.Data.Array
    
This source code will be placed into the directory

    ~/.sle/github/graeme-lockley/mn-Native.Data.Array/1.0.0
    
off of the user's home directory.  Note that only the code against the label `1.0.0` will be placed into this directory.

Finally the file `index.js` is then returned as a `require` to the caller.


