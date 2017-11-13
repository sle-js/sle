const Errors = require("./Errors");
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


const dirExists = directoryName => {
    try {
        return FS.statSync(directoryName).isDirectory();
    } catch (e) {
        return false;
    }
};


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


const mkdirp = directoryName => {
    try {
        if (!dirExists(directoryName)) {
            mkdirp(Path.dirname(directoryName));
            FS.mkdirSync(directoryName);
        }
    } catch (e) {
        // do nothing...
    }
};


const loadPackage = prefix => name => names => {
    const fullPathName = fullLibraryPath(names);
    if (!dirExists(fullPathName)) {
        try {
            console.log(`Installing ${name}`);
            mkdirp(libraryPath(names));

            ChildProcess.execSync(`git clone --quiet -b ${names[2]} --single-branch https://github.com/${prefix}${names[1]}.git ${names[2]} 2>&1 >> /dev/null`, {cwd: libraryPath(names)});

            const testFileName = Path.resolve(fullPathName, "tests.js");
            if (fileExists(testFileName)) {
                console.log(`Running tests ${testFileName}`);
                require(testFileName);
            }
        } catch (e) {
            throw new GeneralException(`Unable to checkout ${name}: ${e}`, {exception: e});
        }
    }
    return require(Path.resolve(fullPathName, 'index.js'));
};


const handlers = {};
handlers.core = loadPackage("sle-js/lib-");
handlers.github = loadPackage("");


const mrequire = callerFileName => name => {
    const names = name.split(':');

    if (names.length === 3) {
        if (names[0] in handlers) {
            return handlers[names[0]](name)(names);
        } else {
            throw new GeneralException(`Unrecognised mrequire handler: ${names[0]}`, {name: name});
        }
    } else {
        throw Errors.UnrecognisedNameFormat(callerFileName)(name);
    }
};


const $mrequire = callerFileName => name => {
    try {
        return Promise.resolve(mrequire(callerFileName)(name));
    } catch (e) {
        return Promise.reject(e);
    }
};


module.exports = {
    $mrequire
};
