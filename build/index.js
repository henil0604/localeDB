"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let fs = require("fs");
const fse = require("fs-extra");
const _path = require("path");
const hideFile = require("hidefile");
let snet_core = require("snet_core");
require("./modules/interface");
let LocaleError = require("./modules/localeError");
let LocaleDB = {};
let LocaleDBExtra = require("./modules/localeDBExtra");
LocaleDB.Connection = (options) => {
    return {};
};
LocaleDB.createDB = (dbName) => {
    return new Promise((resolve) => {
        if (!LocaleDB.isDBExists(dbName)) {
            fse.mkdir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
            fse.writeFileSync(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"), JSON.stringify({
                dbName: dbName,
                id: snet_core.utils.randomToken(20),
                timestamp: Date.now(),
                lastModified: Date.now(),
                stages: []
            }));
            fse.mkdir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "stages"));
        }
        else {
            resolve(new LocaleError({
                error: "Database Already Exists",
                log: false
            }));
        }
    });
};
LocaleDB.deleteDB = (dbName) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        if (LocaleDB.isDBExists()) {
            yield snet_core.fs.deleteDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
        }
        else {
            resolve(new LocaleError({
                error: "Database Doesn't Exists",
                log: false
            }));
        }
    }));
};
LocaleDB.isDBExists = (dbName) => {
    return fse.existsSync(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName)) && fse.existsSync(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"));
};
LocaleDB.init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield LocaleDBExtra.init();
});
LocaleDB.init();
module.exports = LocaleDB;
