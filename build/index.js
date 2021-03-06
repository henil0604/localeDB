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
const _path = require("path");
let snet_core = require("snet_core");
require("./modules/interface");
let Classes = {};
Classes.DB = require("./modules/classes/db");
let LocaleError = require("./modules/localeError");
let LocaleDB = {};
let LocaleDBExtra = require("./modules/localeDBExtra");
LocaleDB._initialized = false;
LocaleDB.ConnectDb = (dbName) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield LocaleDB.init();
        if (yield LocaleDB.isDBExists(dbName)) {
            resolve(yield new Classes.DB(dbName));
        }
        else {
            yield LocaleDB.createDB(dbName);
            resolve(yield LocaleDB.ConnectDb(dbName));
        }
    }));
};
LocaleDB.createDB = (dbName) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield LocaleDB.init();
        if (!(yield LocaleDB.isDBExists(dbName))) {
            yield snet_core.fs.createDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
            let dbJSONObj = {
                dbName: dbName,
                id: snet_core.utils.randomToken(20),
                timestamp: Date.now(),
                lastModified: Date.now(),
                stages: []
            };
            yield snet_core.fs.writeFile(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"), JSON.stringify(dbJSONObj));
            yield snet_core.fs.createDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "stages"));
            let update = LocaleDBExtra.updateDbData();
            delete dbJSONObj.lastModified;
            update.data.dbs.push(dbJSONObj);
            update.update();
            resolve(yield LocaleDB.ConnectDb(dbName));
        }
        else {
            resolve(new LocaleError({
                error: "Database Already Exists",
                log: false
            }));
        }
    }));
};
LocaleDB.deleteDB = (dbName) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield LocaleDB.init();
        if (yield LocaleDB.isDBExists(dbName)) {
            yield snet_core.fs.deleteDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
            let update = LocaleDBExtra.updateDbData();
            for (let i = 0; i < update.data.dbs.length; i++) {
                let dbData = update.data.dbs[i];
                if (dbData.dbName == dbName) {
                    update.data.dbs.splice(i, 1);
                }
            }
            update.update();
            resolve({
                status: "success",
                message: "Deleted Successfully"
            });
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
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield LocaleDB.init();
        let folderExists = yield snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
        let dbFileExists = yield snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"));
        resolve(folderExists && dbFileExists);
    }));
};
LocaleDB.init = () => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        if (LocaleDB._initialized == false || LocaleDBExtra._initialized == false) {
            yield LocaleDBExtra.init();
        }
        LocaleDB._initialized = true;
        resolve(true);
    }));
};
module.exports = LocaleDB;
