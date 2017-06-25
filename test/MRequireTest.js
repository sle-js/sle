const Assert = require("assert");

const mrequire = require("../lib/mrequire");


Assert.equal(mrequire.dirExists("./test"), true);
Assert.equal(mrequire.dirExists("./test/MRequireTest.js"), false);
Assert.equal(mrequire.dirExists("./bob"), false);