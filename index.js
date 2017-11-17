global.mrequire = require("./src/SyncMRequire").mrequire;


global.$import = require("./src/Import").$import;
global.$importAll = require("./src/Import").$importAll;

const Assumption = mrequire("core:System.Assumption:1.0.0");


global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

global.$useOn = mrequire("core:System.Use:1.0.0").useOn;


module.exports = {};

