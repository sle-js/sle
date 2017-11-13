const Path = require("path");

const $mrequire = require("./PromiseMRequire").$mrequire;


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


const $require = name => {
    return (name.indexOf(":") === -1)
        ? new Promise(function (resolve, reject) {
            const dirname =
                Path.dirname(callsite()[3].getFileName());

            const packageName =
                Path.resolve(dirname, name);

            try {
                resolve(require(packageName));
            } catch (e) {
                reject(e);
            }
        })
        : $mrequire(name);
};


module.exports = {
    $require
};
