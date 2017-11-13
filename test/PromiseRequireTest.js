const Assert = require("assert");

$require("./src/fileA")
    .then(fileA => Assert.equal(fileA.toUpper("Hello World"), "HELLO WORLD"))
    .catch(Assert.ifError);
