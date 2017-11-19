const Assert = require("assert");
const Errors = require("./../src/Errors");
const Path = require("path");


$import("./src/fileA")
    .then(fileA => Assert.equal(fileA.toUpper("Hello World"), "HELLO WORLD"))
    .catch(Assert.ifError);


$import("./src/fileZ")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnknownModule(Path.resolve(__dirname, "./ImportTest.js"))(Path.resolve(__dirname, "./src/fileZ"))("MODULE_NOT_FOUND"), err));


// Successfully require a core module
$import("core:Text.Parsing.Combinators:1.0.0")
    .then(Array => true)
    .catch(Assert.ifError);
$import("core:Text.Parsing.Combinators:1.0.0")
    .then(Array => true)
    .catch(Assert.ifError);
$import("core:Text.Parsing.Combinators:1.0.0")
    .then(Array => true)
    .catch(Assert.ifError);
$import("core:Text.Parsing.Combinators:1.0.0")
    .then(Array => true)
    .catch(Assert.ifError);


// Successfully require multiple modules
$importAll(["core:Text.Parsing.Combinators:1.0.0", "./src/fileA", "core:Native.System.IO.FileSystem:1.0.0"])
    .then(imports => true)
    .catch(Assert.ifError);


// Unknown version
$import("core:Text.Parsing.Combinators:0.0.0")
    .then(err => Assert.ifError(JSON.stringify(err)))
    .catch(err => {
        Assert.equal(err.kind, "UnableToRetrievePackage");
        Assert.equal(true, err.message.startsWith("Command failed: git clone --quiet -b 0.0.0 --single-branch https://github.com/sle-js/lib-Text.Parsing.Combinators.git tmp"));
        Assert.deepEqual(Errors.UnableToRetrievePackage(Path.resolve(__dirname, "./ImportTest.js"))(err.message), err)
    });


// Unrecognised mrequire name format
$import("core:Bob")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnrecognisedNameFormat(Path.resolve(__dirname, "./ImportTest.js"))("core:Bob"), err));


// Unrecognised mrequire handler
$import("hello:Bob:1.0.0")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnrecognisedHandler(Path.resolve(__dirname, "./ImportTest.js"))("hello:Bob:1.0.0")("hello")(["core", "github", "use"]), err));


// Importing a native node library
$import("path")
    .then(Path => true)
    .catch(Assert.ifError);


// Apply a tool through an import
$import("use:./template/hello.template core:Tool.Template:1.0.0")
    .then(template => template("Mary"))
    .then(result => Assert.deepEqual(result, "Hello Mary"))
    .catch(Assert.ifError);