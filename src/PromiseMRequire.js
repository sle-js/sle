const Errors = require("./Errors");
const FileSystem = require("./FileSystem");
const FS = require("fs");
const Path = require('path');
const ChildProcess = require("child_process");


const $dirExists = directoryName =>
    FileSystem
        .stat(directoryName)
        .then(stat => Promise.resolve(stat.isDirectory()))
        .catch(_ => Promise.resolve(false));


const fileExists = fileName => {
    try {
        return FS.statSync(fileName).isFile();
    } catch (e) {
        return false;
    }
};


const libraryPath = names =>
    `${process.env.HOME}/.sle/${names[0]}/${names[1]}`;


const fullLibraryPath = names =>
    Path.resolve(libraryPath(names), names[2]);


const $mkdirp = directoryName =>
    $dirExists(directoryName)
        .then(exists =>
            (exists)
                ? Promise.resolve(true)
                : $mkdirp(Path.dirname(directoryName))
                    .then(() => FileSystem.mkdir(directoryName)));


const exec = command => options =>
    new Promise((resolve, reject) =>
        ChildProcess.exec(command, options, (error) =>
            error
                ? reject(error)
                : resolve(true)
        ));


const loadPackage = prefix => callerFileName => name => names => {
    const fullPathName =
        fullLibraryPath(names);

    const checkOutPackage = () => {
        const command =
            `git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${names[2]} 2>&1 >> /dev/null`;

        return exec(command)({cwd: libraryPath(names)})
            .catch(err => Promise.reject(Errors.UnableToRetrievePackage(callerFileName)(err.message.trim())));
    };


    return $dirExists(fullPathName)
        .then(exists => {
                if (exists) {
                    return Promise.resolve(require(Path.resolve(fullPathName, 'index.js')));
                } else {
                    console.log(`Installing ${name}`);

                    return $mkdirp(libraryPath(names))
                        .then(checkOutPackage)
                        .then(() => {
                            const testFileName = Path.resolve(fullPathName, "tests.js");
                            if (fileExists(testFileName)) {
                                console.log(`Running tests ${testFileName}`);
                                require(testFileName);
                            }
                        })
                        .then(() => Promise.resolve(require(Path.resolve(fullPathName, 'index.js'))));
                }
            }
        );
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
