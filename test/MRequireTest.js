const Assert = require("assert");

const mrequire = require("../lib/mrequire");


Assert.equal(mrequire.dirExists("./test"), true);
Assert.equal(mrequire.dirExists("./test/MRequireTest.js"), false);
Assert.equal(mrequire.dirExists("./bob"), false);


Assert.equal(mrequire.libraryPath(["core", "Data.Int", "1.2.3"]), process.env.HOME + "/.sle/core/Data.Int");


Assert.equal(mrequire.fullLibraryPath(["core", "Data.Int", "1.2.3"]), process.env.HOME + "/.sle/core/Data.Int/1.2.3");