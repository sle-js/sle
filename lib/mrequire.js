"use strict";

const fs = require("fs");
const Path = require('path');
const child_process = require("child_process");


class GeneralException {
    constructor(msg, state) {
        this.msg = msg;
        this.state = state;
    }

    toString() {
        return `${this.msg}: ${JSON.stringify(this.state)}`;
    }
}


function mrequire(name) {
    const names = name.split(':');

    if (names.length === 3) {
        if (names[0] === 'core') {
            return loadCorePackage(name, names)
        } else {
            throw new GeneralException("Unrecognised mrequire prefix: " + names[0], {name: name});
        }
    } else {
        throw new GeneralException("Unrecognised mrequire name format", {name: name});
    }
}


function loadCorePackage(name, names) {
    let fullPathName = fullLibraryPath(names);
    if (dirExists(fullPathName)) {
        return require(fullPathName + '/index.js');
    } else {
        try {
            console.log(`Installing ${name}`);
            mkdirp(libraryPath(names));

            child_process.execSync(`git clone --quiet -b ${names[2]} --single-branch https://github.com/graeme-lockley/mn-${names[1]}.git ${names[2]} 2>&1 >> /dev/null`, {cwd: libraryPath(names)});
            return require(fullPathName + '/index');
        } catch (e) {
            throw new GeneralException(`Unable to checkout ${name}: ${e}`, {exception: e});
        }
    }
}


function fullLibraryPath(names) {
    return `${libraryPath(names)}/${names[2]}`;
}


function libraryPath(names) {
    return `${process.env.HOME}/.mn/libs/mn-${names[1]}`;
}


function mkdirp(directoryName) {
    try {
        if (!dirExists(directoryName)) {
            mkdirp(Path.dirname(directoryName));
            fs.mkdirSync(directoryName);
        }
    } catch (e) {
        // do nothing...
    }
}


function dirExists(directoryName) {
    try {
        const stats = fs.statSync(directoryName);

        return stats.isDirectory();
    } catch (e) {
        return false;
    }
}


module.exports = mrequire;
