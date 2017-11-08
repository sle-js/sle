const $require = name => {
    return new Promise(function (resolve, reject) {
        try {
            resolve(require(name));
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    $require
};