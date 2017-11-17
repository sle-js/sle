const Errors = require("./Errors");
const FileSystem = require("./FileSystem");
const Path = require('path');
const ChildProcess = require("child_process");


const log = message =>
    Promise.resolve(console.log(message));


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
        .then(stat => stat.isDirectory())
        .catch(() => false);


const $fileExists = fileName =>
    FileSystem
        .stat(fileName)
        .then(stat => stat.isFile())
        .catch(() => false);


const $mkdirs = directoryName =>
    $dirExists(directoryName)
        .then(exists =>
            (exists)
                ? Promise.resolve(true)
                : $mkdirs(Path.dirname(directoryName))
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


const $random = () =>
    Promise.resolve(Math.random());


const $randomInRange = min => max =>
    $random()
        .then(r => Math.floor((r * (max - min) + min)));


const $mkTmpName = prefix =>
    $randomInRange(0)(100000000)
        .then(r => `${prefix}${r}`);


const $removeAll = name =>
    FileSystem
        .stat(name)
        .then(stat =>
            stat.isDirectory()
                ? FileSystem.readdir(name)
                    .then(dirs => Promise
                        .all(dirs.map(n => Path.resolve(name, n)).map($removeAll))
                        .then(() => FileSystem.rmdir(name)))
                : FileSystem.unlink(name));


const loadPackage = prefix => callerFileName => name => names => {
    const libraryPath =
        `${process.env.HOME}/.sle/${names[0]}/${names[1]}`;

    const fullPathName =
        Path.resolve(libraryPath, names[2]);

    const testFileName =
        Path.resolve(fullPathName, "tests.js");

    const checkOutPackage = targetName => {
        const command =
            `git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${targetName} 2>&1 >> /dev/null`;

        return $exec(command)({cwd: libraryPath})
            .catch(err => Promise.reject(Errors.UnableToRetrievePackage(callerFileName)(err.message.trim())));
    };

    const performTests = () =>
        $fileExists(testFileName)
            .then(testFileExists =>
                testFileExists
                    ? log(`Running tests ${testFileName}`)
                        .then(() => $require(callerFileName)(testFileName))
                    : false);

    return $dirExists(fullPathName)
        .then(exists =>
            exists
                ? true
                : log(`Installing ${name}`)
                    .then(() => $mkdirs(libraryPath))
                    .then(() => $mkTmpName("tmp"))
                    .then(tmpName =>
                        checkOutPackage(tmpName)
                            .then(() => FileSystem
                                .rename(Path.resolve(libraryPath, tmpName))(Path.resolve(libraryPath, names[2]))
                                .catch(() => $removeAll(Path.resolve(libraryPath, tmpName))))
                            .then(performTests)
                    )
        )
        .then(() => $require(callerFileName)(Path.resolve(fullPathName, 'index.js')));
};


const handlers = {};
handlers.core = loadPackage("sle-js/lib-");
handlers.github = loadPackage("");


module.exports = callerFileName => name =>
    Promise
        .resolve(name.split(':'))
        .then(names => (names.length === 3)
            ? (names[0] in handlers)
                ? handlers[names[0]](callerFileName)(name)(names)
                : Errors.UnrecognisedHandler(callerFileName)(name)(names[0])(Object.keys(handlers))
            : Errors.UnrecognisedNameFormat(callerFileName)(name));
