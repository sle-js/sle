global.mrequire = require("./src/SyncMRequire").mrequire;


global.$require = require("./src/PromiseRequire").$require;

const Assumption = mrequire("core:System.Assumption:1.0.0");


global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

global.$useOn = mrequire("core:System.Use:1.0.0").useOn;


module.exports = {};

