global.mrequire = require("./src/MRequire").mrequire;

const Assumption = mrequire("core:System.Assumption:1.0.0");
global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

global.$import = require("./src/Import").$import;
global.$importAll = require("./src/Import").$importAll;

global.$useOn = mrequire("core:System.Use:1.0.1").useOn;


module.exports = {};

