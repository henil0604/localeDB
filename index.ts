let fs = require("fs");
const fse = require("fs-extra");
const hideFile = require("hidefile");
require("./modules/interface");

let LocaleDB: LocaleDBInterface = {};
let LocaleDBExtra: LocaleDBExtraInterface = require("./modules/localeDBExtra");

LocaleDB.Connection = (
  options: LocaleDBConnectionOptionsInterface
): LocaleDBConnection => {
  return {};
};

LocaleDB.createDB = (dbName: string) => {};

LocaleDB.isDBExists = (dbName: string) => {};

LocaleDBExtra.init();
export = LocaleDB;
