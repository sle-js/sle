const mrequire = require("./SyncMRequire").mrequire;


const $mrequire = name => {
    try {
        return Promise.resolve(mrequire(name));
    } catch (e) {
        return Promise.reject(e);
    }
};


module.exports = {
    $mrequire
};
