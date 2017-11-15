const Assert = require("assert");
const Errors = require("./../src/Errors");
const Path = require("path");


$require("./src/fileA")
    .then(fileA => Assert.equal(fileA.toUpper("Hello World"), "HELLO WORLD"))
    .catch(Assert.ifError);


$require("./src/fileZ")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnknownModule(Path.resolve(__dirname, "./PromiseRequireTest.js"))(Path.resolve(__dirname, "./src/fileZ"))("MODULE_NOT_FOUND"), err));


// Successfully require a core module
$require("core:Text.Parsing.Combinators:1.0.0")
    .then(Array => true)
    .catch(Assert.ifError);


// Unknown version
$require("core:Text.Parsing.Combinators:0.0.0")
    .then(err => Assert.ifError(JSON.stringify(err)))
    .catch(err => Assert.deepEqual(Errors.UnableToRetrievePackage(Path.resolve(__dirname, "./PromiseRequireTest.js"))("Command failed: git clone --quiet -b 0.0.0 --single-branch https://github.com/sle-js/lib-Text.Parsing.Combinators.git 0.0.0 2>&1 >> /dev/null"), err));


// Unrecognised mrequire name format
$require("core:Bob")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnrecognisedNameFormat(Path.resolve(__dirname, "./PromiseRequireTest.js"))("core:Bob"), err));


// Unrecognised mrequire handler
$require("hello:Bob:1.0.0")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnrecognisedHandler(Path.resolve(__dirname, "./PromiseRequireTest.js"))("hello:Bob:1.0.0")("hello")(["core", "github"]), err));