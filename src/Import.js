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

            const requireItem = name => {
                try {
                    resolve(require(name));
                } catch (e) {
                    reject(Errors.UnknownModule(callerFileName)(name)(e.code));
                }
            };

            if (name.startsWith(".") || name.startsWith(Path.sep)) {
                const packageName =
                    Path.resolve(callerDirName, name);

                requireItem(packageName);
            } else {
                requireItem(name);
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
