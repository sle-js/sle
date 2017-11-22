const Errors = require("./Errors");
const FileSystem = mrequire("core:Native.System.IO.FileSystem:1.1.0");
const Path = require('path');
const ChildProcess = require("child_process");
const String = require("./String");


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


const loadPackage = prefix => callerFileName => name => {
    const names =
        name.split(":");

    if (names.length === 3) {
        const libraryPath =
            `${process.env.HOME}/.sle/${names[0]}/${names[1]}`;

        const fullPathName =
            Path.resolve(libraryPath, names[2]);

        const checkOutPackage = targetName => {
            const command =
                `git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${targetName} 2>&1 >> /dev/null`;

            return $exec(command)({cwd: libraryPath})
                .catch(err => Promise.reject(Errors.UnableToRetrievePackage(callerFileName)(err.message.trim())));
        };

        const performTests = tmpName => {
            const tmpFullPathName =
                Path.resolve(libraryPath, tmpName);

            const tmpTestFileName =
                Path.resolve(tmpFullPathName, "tests.js");

            return FileSystem
                .isFile(tmpTestFileName)
                .then(testFileExists =>
                    testFileExists
                        ? log(`Running tests ${tmpTestFileName}`)
                            .then(() => $require(callerFileName)(tmpTestFileName))
                        : false);
        };

        return FileSystem
            .isDirectory(fullPathName)
            .then(exists =>
                exists
                    ? true
                    : log(`Installing ${name}`)
                        .then(() => FileSystem.mkdirs(libraryPath))
                        .then(() => $mkTmpName("tmp"))
                        .then(tmpName =>
                            checkOutPackage(tmpName)
                                .then(() => performTests(tmpName))
                                .then(() => FileSystem
                                    .rename(Path.resolve(libraryPath, tmpName))(Path.resolve(libraryPath, names[2]))
                                    .catch(() => FileSystem.removeAll(Path.resolve(libraryPath, tmpName)))
                                )
                        )
            )
            .then(() => $require(callerFileName)(Path.resolve(fullPathName, 'index.js')));
    } else {
        return Promise.reject(Errors.UnrecognisedNameFormat(callerFileName)(name));
    }
};


const useOn = callerFileName => importURL => {
    const prefixlessImportURL =
        String.drop(4)(importURL);

    const names =
        prefixlessImportURL.split(" ");

    if (names.length === 2) {
        const inputFileName =
            Path.resolve(Path.dirname(callerFileName), names[0]);

        const toolURL =
            names[1];

        return $useOn(toolURL)(inputFileName);
    } else {
        return Promise.reject(Errors.UnrecognisedNameFormat(callerFileName)(importURL));
    }
};


const handlers = {
    core: loadPackage("sle-js/lib-"),
    github: loadPackage(""),
    use: useOn
};


module.exports = callerFileName => name => {
    const prefix =
        String.takeWhile(c => c !== 58)(name);

    return prefix in handlers
        ? handlers[prefix](callerFileName)(name)
        : Promise.reject(Errors.UnrecognisedHandler(callerFileName)(name)(prefix)(Object.keys(handlers)));
};