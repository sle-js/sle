const Assert = require("assert");

const mrequire = require("../src/MRequire");


Assert.equal(mrequire.dirExists("./test"), true);
Assert.equal(mrequire.dirExists("./test/MRequireTest.js"), false);
Assert.equal(mrequire.dirExists("./bob"), false);


Assert.equal(mrequire.libraryPath(["core", "Data.Int", "1.2.3"]), process.env.HOME + "/.sle/core/Data.Int");


Assert.equal(mrequire.fullLibraryPath(["core", "Data.Int", "1.2.3"]), process.env.HOME + "/.sle/core/Data.Int/1.2.3");
Assert.equal(mrequire.fullLibraryPath(["github", "graeme-lockley/mn-Data.Int", "1.2.3"]), process.env.HOME + "/.sle/github/graeme-lockley/mn-Data.Int/1.2.3");


const randomString = () =>
    (Math.random() + "").substring(2, 10);

const randomPath =
    "./.idea/tmp/" + randomString() + "/" + randomString();

if (!mrequire.dirExists(randomPath)) {
    mrequire.mkdirp(randomPath);
    Assert.equal(mrequire.dirExists(randomPath), true);
}