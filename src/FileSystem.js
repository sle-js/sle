//- The purpose of this package is to provide a Promise based interface against Node.js's FS package.
//-
//- Characteristics of functions within native packages:
//- * They may not throw an exception,
//- * They may not mutate their parameters,
//- * They are all curried, and
//- * They may not return nil or undefined.
//-
//- Further to that a native package may only be dependent on other native packages or standard node.js packages

const FS = require("fs");
const Path = require("path");


const denodeify = proc =>
    new Promise((fulfill, reject) => {
        proc((err, result) => {
            if (err) {
                reject(err);
            } else {
                fulfill(result);
            }
        });
    });


const stat = fileName =>
    denodeify(cb => FS.stat(fileName, cb));


const lstat = fileName =>
    denodeify(cb => FS.lstat(fileName, cb));


const readFile = fileName =>
    denodeify(cb => FS.readFile(fileName, {encoding: "utf8"}, cb));


const readdir = directory =>
    denodeify(cb => FS.readdir(directory, cb));


const rename = oldName => newName =>
    denodeify(cb => FS.rename(oldName, newName, cb));


const open = fileName => options =>
    denodeify(cb => FS.open(fileName, options, cb));


const futimes = atime => mtime => fileDescriptor =>
    denodeify(cb => FS.futimes(fileDescriptor, atime, mtime, cb));


const close = fileDescriptor =>
    denodeify(cb => FS.close(fileDescriptor, cb));


const writeFile = fileName => content =>
    denodeify(cb => FS.writeFile(fileName, content, {encoding: "utf8"}, cb));


const mkdir = fileName =>
    denodeify(cb => FS.mkdir(fileName, cb));


const rmdir = fileName =>
    denodeify(cb => FS.rmdir(fileName, cb));


const unlink = name =>
    denodeify(cb => FS.unlink(name, cb));


const isDirectory = directoryName =>
    stat(directoryName)
        .then(stat => stat.isDirectory())
        .catch(() => false);


const isFile = fileName =>
    stat(fileName)
        .then(stat => stat.isFile())
        .catch(() => false);


const mkdirs = directoryName =>
    isDirectory(directoryName)
        .then(exists =>
            exists
                ? Promise.resolve(true)
                : mkdirs(Path.dirname(directoryName))
                    .then(() =>
                        mkdir(directoryName)
                            .then(() => true)
                            .catch(() => false)));


const removeAll = name =>
    isDirectory(name)
        .then(exists =>
            exists
                ? readdir(name)
                    .then(dirs => Promise
                        .all(dirs.map(n => Path.resolve(name, n)).map(removeAll))
                        .then(() => rmdir(name)))
                : unlink(name));


module.exports = {
    close,
    isDirectory,
    isFile,
    futimes,
    lstat,
    mkdir,
    mkdirs,
    open,
    readdir,
    readFile,
    removeAll,
    rename,
    rmdir,
    stat,
    unlink,
    writeFile
};