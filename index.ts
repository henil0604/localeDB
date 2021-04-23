import { exit } from "process";

let fs = require("fs");
const fse = require("fs-extra");
const _path = require("path");
const hideFile = require("hidefile");
let snet_core = require("snet_core");
require("./modules/interface");
let LocaleError = require("./modules/localeError");

let LocaleDB: LocaleDBInterface = {};
let LocaleDBExtra: LocaleDBExtraInterface = require("./modules/localeDBExtra");

LocaleDB.Connection = (
    options: LocaleDBConnectionOptionsInterface
): LocaleDBConnection => {
    return {};
};

LocaleDB.createDB = (dbName: string) => {
    return new Promise((resolve) => {

        if (!LocaleDB.isDBExists(dbName)) {

            fse.mkdir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
            fse.writeFileSync(
                _path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"),
                JSON.stringify(
                    {
                        dbName: dbName,
                        id: snet_core.utils.randomToken(20),
                        timestamp: Date.now(),
                        lastModified: Date.now(),
                        stages: []
                    }
                )
            )
            fse.mkdir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "stages"));

        } else {
            resolve(new LocaleError({
                error: "Database Already Exists",
                log: false
            }))
        }
    })
};

LocaleDB.deleteDB = (dbName: string) => {
    return new Promise(async resolve => {
        if (LocaleDB.isDBExists()) {
            await snet_core.fs.deleteDir(
                _path.join(LocaleDBExtra.paths.dbsFolder.path, dbName)
            )
        } else {
            resolve(new LocaleError({
                error: "Database Doesn't Exists",
                log: false
            }))
        }
    })
}

LocaleDB.isDBExists = (dbName: string): boolean => {
    return fse.existsSync(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName)) && fse.existsSync(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"));
};


LocaleDB.init = async () => {
    await LocaleDBExtra.init()

    // console.log(await LocaleDB.createDB("wispychat"))
    // console.log(await LocaleDB.deleteDB("wispychat"))
}

LocaleDB.init()
export = LocaleDB;
