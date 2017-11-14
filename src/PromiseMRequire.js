const Errors = require("./Errors");
const FileSystem = require("./FileSystem");
const FS = require("fs");
const Path = require('path');
const ChildProcess = require("child_process");


class GeneralException {
    constructor(msg, state) {
        this.msg = msg;
        this.state = state;
    }

    toString() {
        return `${this.msg}: ${JSON.stringify(this.state)}`;
    }
}


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


const loadPackage = prefix => name => names => {
    const fullPathName =
        fullLibraryPath(names);

    return $dirExists(fullPathName)
        .then(exists => {
                if (exists) {
                    return Promise.resolve(require(Path.resolve(fullPathName, 'index.js')));
                } else {
                    console.log(`Installing ${name}`);

                    return $mkdirp(libraryPath(names))
                        .then(() => {
                            try {
                                ChildProcess.execSync(`git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${names[2]} 2>&1 >> /dev/null`, {cwd: libraryPath(names)});

                                const testFileName = Path.resolve(fullPathName, "tests.js");
                                if (fileExists(testFileName)) {
                                    console.log(`Running tests ${testFileName}`);
                                    require(testFileName);
                                }
                            } catch (e) {
                                throw new GeneralException(`Unable to checkout ${name}: ${e}`, {exception: e});
                            }
                        })
                        .then(() => Promise.resolve(require(Path.resolve(fullPathName, 'index.js'))));
                }
            }
        )
        .catch(e => new GeneralException(`Unable to checkout ${name}: ${e}`, {exception: e}));
};


const handlers = {};
handlers.core = loadPackage("sle-js/lib-");
handlers.github = loadPackage("");


const $mrequire = callerFileName => name => {
    const names =
        name.split(':');

    if (names.length === 3) {
        if (names[0] in handlers) {
            return handlers[names[0]](name)(names);
        } else {
            return Promise.reject(Errors.UnrecognisedHandler(callerFileName)(name)(names[0])(Object.keys(handlers)));
        }
    } else {
        return Promise.reject(Errors.UnrecognisedNameFormat(callerFileName)(name));
    }
};


module.exports = {
    $mrequire
};
