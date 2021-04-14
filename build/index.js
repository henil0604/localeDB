"use strict";
let fs = require("fs");
const fse = require("fs-extra");
const hideFile = require("hidefile");
require("./modules/interface");
let LocaleDB = {};
let LocaleDBExtra = require("./modules/localeDBExtra");
LocaleDB.Connection = (options) => {
    return {};
};
LocaleDB.createDB = (dbName) => { };
LocaleDB.isDBExists = (dbName) => { };
LocaleDBExtra.init();
module.exports = LocaleDB;
