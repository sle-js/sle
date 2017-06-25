const Assert = require("assert");

const mrequire = require("../lib/mrequire");


Assert.equal(mrequire.dirExists("."), true);
Assert.equal(mrequire.dirExists("./bob"), false);