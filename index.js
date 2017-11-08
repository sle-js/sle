global.mrequire = require("./src/SyncMRequire").mrequire;

const Assumption = mrequire("core:System.Assumption:1.0.0");


global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

module.exports = {};

