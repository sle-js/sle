const Errors = require("./Errors");
const FileSystem = require("./FileSystem");
const Path = require('path');
const ChildProcess = require("child_process");


const $require = callerFileName => name => {
    return new Promise(function (resolve, reject) {
        try {
            resolve(require(name));
        } catch (e) {
            reject(Errors.UnknownModule(callerFileName)(name)(e.code));
        }
    });
};


const $dirExists = directoryName =>
    FileSystem
        .stat(directoryName)
        .then(stat => Promise.resolve(stat.isDirectory()))
        .catch(_ => Promise.resolve(false));


const $fileExists = fileName =>
    FileSystem
        .stat(fileName)
        .then(stat => Promise.resolve(stat.isFile()))
        .catch(() => Promise.resolve(false));


const $mkdirp = directoryName =>
    $dirExists(directoryName)
        .then(exists =>
            (exists)
                ? Promise.resolve(true)
                : $mkdirp(Path.dirname(directoryName))
                    .then(() => FileSystem
                        .mkdir(directoryName)
                        .then(() => true)
                        .catch(() => false)));


const $exec = command => options =>
    new Promise((resolve, reject) =>
        ChildProcess.exec(command, options, (error) =>
            error
                ? reject(error)
                : resolve(true)
        ));


const loadPackage = prefix => callerFileName => name => names => {
    const libraryPath =
        `${process.env.HOME}/.sle/${names[0]}/${names[1]}`;

    const fullPathName =
        Path.resolve(libraryPath, names[2]);

    const testFileName =
        Path.resolve(fullPathName, "tests.js");

    const checkOutPackage = () => {
        const command =
            `git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${names[2]} 2>&1 >> /dev/null`;

        return $exec(command)({cwd: libraryPath})
            .catch(err => Promise.reject(Errors.UnableToRetrievePackage(callerFileName)(err.message.trim())));
    };

    const performTests = () =>
        $fileExists(testFileName)
            .then(testFileExists =>
                testFileExists
                    ? Promise
                        .resolve(console.log(`Running tests ${testFileName}`))
                        .then($require(callerFileName)(testFileName))
                        .then(() => true)
                    : Promise.resolve(false));

    return $dirExists(fullPathName)
        .then(exists =>
            exists
                ? Promise.resolve(true)
                : Promise.resolve(console.log(`Installing ${name}`))
                    .then(() => $mkdirp(libraryPath))
                    .then(checkOutPackage)
                    .then(performTests))
        .then(() => $require(callerFileName)(Path.resolve(fullPathName, 'index.js')));
};


const handlers = {};
handlers.core = loadPackage("sle-js/lib-");
handlers.github = loadPackage("");


const $mrequire = callerFileName => name =>
    Promise
        .resolve(name.split(':'))
        .then(names => (names.length === 3)
            ? (names[0] in handlers)
                ? handlers[names[0]](callerFileName)(name)(names)
                : Errors.UnrecognisedHandler(callerFileName)(name)(names[0])(Object.keys(handlers))
            : Errors.UnrecognisedNameFormat(callerFileName)(name));


module.exports = {
    $mrequire
};
