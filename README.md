# sle

The sle (Simple Language Experiments) is a Node.js package that supports the building of applications offering the 
following features:

* Using the `mrequire` function it provides the ability to refer to packages that are stored in a github repository.
  This has the benefit of not needing an external file to indicate what are the exact version numbers of dependent
  packages.
* Allows intrinsic tests, called assumptions, to be include in source files thereby reducing the need to export the
  internal implementation of a package in order to support extrinsic unit testing.


## mrequire

Dependencies to external packages is achieved by introducing the function

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
   
   
### Core Example

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


### Github Example

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


## Assumptions

Any function that is defined within a source file can have any number of assumptions to be included in the file.  These
assumptions are then executed when the source file is loaded and, in the event of an assumption failing, will cause the
loading of the source file to be aborted.

The following are illustrative examples of using `assumption` and `assumptionEqual`:
 
```javascript
//- Get the number of elements within an array.
//= length :: Array a -> Int
const length = a =>
    a.length;
assumption(length([]) === 0);
assumption(length([1, 2, 3]) === 3);


//= indexOf :: String -> String -> Maybe Int
const indexOf = pattern => s => {
    const index = s.indexOf(pattern);

    return index === -1
        ? Maybe.Nothing
        : Maybe.Just(index);
};
assumptionEqual(indexOf("world")("hello"), Maybe.Nothing);
assumptionEqual(indexOf("hello")("hello"), Maybe.Just(0));
assumptionEqual(indexOf("ll")("hello"), Maybe.Just(2));
```