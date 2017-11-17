const Errors = require("./Errors");
const Path = require("path");

const remoteImport = require("./RemoteImport");


const callsite = function () {
    const orig =
        Error.prepareStackTrace;

    Error.prepareStackTrace = (_, stack) => stack;

    const err =
        new Error;

    Error.captureStackTrace(err, arguments.callee);

    const stack =
        err.stack;

    Error.prepareStackTrace = orig;

    return stack;
};


const importItem = callerFileName => name =>
    (name.indexOf(":") === -1)
        ? new Promise(function (resolve, reject) {
            const callerDirName =
                Path.dirname(callerFileName);

            const packageName =
                Path.resolve(callerDirName, name);

            try {
                resolve(require(packageName));
            } catch (e) {
                reject(Errors.UnknownModule(callerFileName)(packageName)(e.code));
            }
        })
        : remoteImport(callerFileName)(name);


const $import = name => {
    const callerFileName =
        callsite()[1].getFileName();

    return importItem(callerFileName)(name);
};


const $importAll = names => {
    const callerFileName =
        callsite()[1].getFileName();

    return Promise.all(names.map(importItem(callerFileName)));
};


module.exports = {
    $import,
    $importAll
};
