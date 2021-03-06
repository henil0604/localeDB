const _path = require("path");
let snet_core = require("snet_core");
require("./modules/interface");
let Classes: LocaleDBVarsClasses = {};
Classes.DB = require("./modules/classes/db");
let LocaleError = require("./modules/localeError");

let LocaleDB: LocaleDBInterface = {};
let LocaleDBExtra: LocaleDBExtraInterface = require("./modules/localeDBExtra");

LocaleDB._initialized = false;

/**
 * 
 * @param {string} dbName Database to Connect
 * @returns {Promise<LocaleDBClassesDB>}
 */
LocaleDB.ConnectDb = (dbName: string): Promise<LocaleDBClassesDB> => {
    return new Promise(async resolve => {
        await LocaleDB.init();

        if (await LocaleDB.isDBExists(dbName)) {
            resolve(await new Classes.DB(dbName));
        } else {
            await LocaleDB.createDB(dbName);
            resolve(await LocaleDB.ConnectDb(dbName))
        }
    })
};

LocaleDB.createDB = (dbName: string): Promise<LocaleDBClassesDB> => {
    return new Promise(async (resolve) => {
        await LocaleDB.init();

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

            let update = LocaleDBExtra.updateDbData();
            delete dbJSONObj.lastModified;
            update.data.dbs.push(dbJSONObj)
            update.update()

            resolve(await LocaleDB.ConnectDb(dbName))

        } else {
            resolve(new LocaleError({
                error: "Database Already Exists",
                log: false
            }))
        }
    })
};

LocaleDB.deleteDB = (dbName: string): Promise<LocaleDBPromiseDefaultResponse | any> => {
    return new Promise(async resolve => {
        await LocaleDB.init();

        if (await LocaleDB.isDBExists(dbName)) {
            await snet_core.fs.deleteDir(
                _path.join(LocaleDBExtra.paths.dbsFolder.path, dbName)
            )

            let update = LocaleDBExtra.updateDbData();
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

LocaleDB.isDBExists = (dbName: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
        await LocaleDB.init();

        let folderExists = await snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName));
        let dbFileExists = await snet_core.fs.isExist(_path.join(LocaleDBExtra.paths.dbsFolder.path, dbName, "db.json"));

        resolve(folderExists && dbFileExists)
    })
};


LocaleDB.init = () => {
    return new Promise(async resolve => {
        if (LocaleDB._initialized == false || LocaleDBExtra._initialized == false) {
            await LocaleDBExtra.init()
        }
        LocaleDB._initialized = true;
        resolve(true)
    })
}


export = LocaleDB