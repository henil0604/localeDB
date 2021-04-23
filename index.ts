import localeDBExtra = require("./modules/localeDBExtra");

let fs = require("fs");
const fse = require("fs-extra");
const _path = require("path");
const hideFile = require("hidefile");
let snet_core = require("snet_core");
require("./modules/interface");
let Classes: LocaleDBVarsClasses = {};
Classes.DB = require("./modules/classes/db");
let LocaleError = require("./modules/localeError");

let LocaleDB: LocaleDBInterface = {};
let LocaleDBExtra: LocaleDBExtraInterface = require("./modules/localeDBExtra");

LocaleDB.ConnectDb = (dbName: string) => {
    return new Promise(async resolve => {

        if (await LocaleDB.isDBExists(dbName)) {
            resolve(await new Classes.DB(dbName));
        } else {
            await LocaleDB.createDB(dbName);
            resolve(await LocaleDB.ConnectDb(dbName))
        }
    })
};

LocaleDB.createDB = (dbName: string) => {
    return new Promise(async (resolve) => {
        if (!(await LocaleDB.isDBExists(dbName))) {

            await snet_core.fs.createDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
            let dbJSONObj = {
                dbName: dbName,
                id: snet_core.utils.randomToken(20),
                timestamp: Date.now(),
                lastModified: Date.now(),
                stages: []
            }


            await snet_core.fs.writeFile(
                _path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"),
                JSON.stringify(dbJSONObj)
            )

            await snet_core.fs.createDir(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "stages"));

            let update = localeDBExtra.updateDbData();
            update.data.dbs.push(dbJSONObj)
            update.update()

            resolve(new Classes.DB(dbName))

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
        if (await LocaleDB.isDBExists(dbName)) {
            await snet_core.fs.deleteDir(
                _path.join(LocaleDBExtra.paths.dbsFolder.path, dbName)
            )

            let update = localeDBExtra.updateDbData();
            for (let i = 0; i < update.data.dbs.length; i++) {
                let dbData = update.data.dbs[i];

                if (dbData.dbName == dbName) {
                    update.data.dbs.splice(i, 1)
                }
            }
            update.update()

            resolve({
                status: "success",
                message: "Deleted Successfully"
            })
        } else {
            resolve(new LocaleError({
                error: "Database Doesn't Exists",
                log: false
            }))
        }
    })
}

LocaleDB.isDBExists = (dbName: string) => {
    return new Promise(async (resolve) => {
        let folderExists = await snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
        let dbFileExists = await snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"));

        resolve(folderExists && dbFileExists)
    })
};


LocaleDB.init = async () => {

    await LocaleDBExtra.init()

    // let con: LocaleDBClassesDB = await LocaleDB.ConnectDb("wispychat")

    // await con.init()
    // await con.createStage("users")
    // // await con.deleteStage("users")

    // await con.addData("users", {
    //     username: "henil0604",
    //     password: "12345"
    // })

    // console.log(await con.getStageData("users"))


    // console.log(con)

}

LocaleDB.init()
export = LocaleDB;
