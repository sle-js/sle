const Assert = require("assert");
const Errors = require("./../src/Errors");
const Path = require("path");


$require("./src/fileA")
    .then(fileA => Assert.equal(fileA.toUpper("Hello World"), "HELLO WORLD"))
    .catch(Assert.ifError);


$require("./src/fileZ")
    .then(Assert.ifError)
    .catch(err => Assert.deepEqual(Errors.UnknownModule(Path.resolve(__dirname, "./PromiseRequireTest.js"))(Path.resolve(__dirname, "./src/fileZ"))("MODULE_NOT_FOUND"), err));
