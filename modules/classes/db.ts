let snet_core = require("snet_core");
import LocaleDBExtra = require("../localeDBExtra");
import LocaleError = require("../localeError");
let path = require("path")
require("../interface");


require("../../modules/interface");

export = class DB implements LocaleDBClassesDB {
    dbName: string;
    _temp: object;
    info: any;
    _paths: LocaleDBClassesDBPaths = {};

    constructor(dbName) {
        this.dbName = dbName;
        this._temp = {}
        this.info = {}

        this._paths.db = path.join(LocaleDBExtra.paths.dbsFolder.path, this.dbName);
        this._paths.jsonFile = path.join(this._paths.db, 'db.json');
        this._paths.stages = path.join(this._paths.db, 'stages/');

    }

    init() {
        return new Promise(async resolve => {
            await LocaleDBExtra.init()

            this.info = await this.getDbInfo();

            resolve(this)
        })
    }

    getDbInfo() {
        return new Promise(async (resolve) => {

            let path = `${LocaleDBExtra.paths.dbsFolder.path}/${this.dbName}/db.json`;

            let data = require(path);

            resolve(data)
        })
    }

    refreshDbInfo() {
        return new Promise(async resolve => {
            this.info = await this.getDbInfo();

            resolve(this.info)
        })
    }

    isStageExists(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {

            let folderExists = await snet_core.fs.isExist(path.join(this._paths.stages, stageName));
            let stageJsonFileExists = await snet_core.fs.isExist(path.join(this._paths.stages, stageName, "stage.json"));

            resolve(folderExists && stageJsonFileExists);
        })
    }

    createStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {

            if (!await this.isStageExists(stageName)) {
                let stageFolder = path.join(this._paths.stages, stageName);

                await snet_core.fs.createDir(stageFolder)

                let stageJsonFile = path.join(stageFolder, "stage.json");

                await snet_core.fs.createFile(stageJsonFile);

                let stageJsonObj = {
                    dbName: this.dbName,
                    stageName: stageName,
                    timestamp: Date.now(),
                    lastModified: Date.now(),
                    dataFilePath: path.join(stageFolder, "data.json"),
                    stageId: snet_core.utils.randomToken(20)
                }

                await snet_core.fs.writeFile(stageJsonFile, JSON.stringify(stageJsonObj));

                await snet_core.fs.createFile(path.join(stageFolder, "data.json"))

                await snet_core.fs.writeFile(path.join(stageFolder, "data.json"), JSON.stringify({
                    data: []
                }))

                let updateDbJsonFile = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile)
                updateDbJsonFile.data.stages.push(stageJsonObj);
                updateDbJsonFile.update()

                this.refreshDbInfo()
                resolve({
                    status: "success",
                    message: "Successfuly Created Stage"
                })

            } else {
                this.refreshDbInfo()
                resolve(new LocaleError({
                    error: "Stage Already Exists",
                    log: false
                }))
            }
        })
    }

    deleteStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {

            if (await this.isStageExists(stageName)) {

                let stageFolder = path.join(this._paths.stages, stageName);

                await snet_core.fs.deleteDir(stageFolder);

                let updateDbFile = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
                for (let i = 0; i < updateDbFile.data.stages.length; i++) {
                    let stage = updateDbFile.data.stages[i];
                    if (stage.stageName == stageName) {
                        updateDbFile.data.stages.splice(i, 1);
                    }
                }
                updateDbFile.update()

                resolve({
                    status: "success",
                    result: "Successfuly Deleted Stage"
                })

            } else {
                resolve(new LocaleError({
                    error: "No Stage Found",
                    log: false
                }))
            }
        })
    }

    addData(stageName, data, _checkStageExists = true) {
        if (stageName == undefined || data == undefined || _checkStageExists == undefined) {
            return null;
        }
        return new Promise(async resolve => {
            if (await this.isStageExists(stageName)) {

                data.dataId = snet_core.utils.randomToken(20);

                let dataFile = path.join(this._paths.stages, stageName, "data.json");

                let update = LocaleDBExtra.utils.updateJsonFile(dataFile);
                update.data.data.push(data);
                update.update();

                let updateStageJsonLastModified = LocaleDBExtra.utils.updateJsonFile(path.join(this._paths.stages, stageName, "stage.json"));
                updateStageJsonLastModified.data.lastModified = Date.now()
                updateStageJsonLastModified.update()

                let updateDbJsonLastModified = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
                updateDbJsonLastModified.data.lastModified = Date.now()
                updateDbJsonLastModified.update()

                resolve(data)

            } else {
                await this.createStage(stageName);
                resolve(await this.addData(stageName, data, true))
            }
        })
    }

    getStageData(stageName): Promise<LocaleDBPromiseDefaultResponse> {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {

            if (await this.isStageExists(stageName)) {


                let dataFile = path.join(this._paths.stages, stageName, "data.json");

                let data = require(dataFile).data;

                resolve({
                    status: "success",
                    result: data
                })

            } else {
                resolve({
                    status: "error",
                    message: "Stage Does not Exists"
                })
            }
        })
    }

    deleteDataById(stageName, dataId): Promise<LocaleDBPromiseDefaultResponse> {
        if (stageName == undefined || dataId == undefined) {
            return null;
        }
        return new Promise(async resolve => {

            let data = await this.getStageData(stageName);
            if (data.status == "success") {

                if (data.result.length > 0) {
                    let deletedData;

                    for (let i = 0; i < data.result.length; i++) {
                        let d = data.result[i];

                        if (d.dataId == dataId) {

                            data.result.splice(i, 1);

                            let dataFile = path.join(this._paths.stages, stageName, "data.json");

                            let update = LocaleDBExtra.utils.updateJsonFile(dataFile);
                            update.data.data = data.result;
                            update.update()
                            deletedData = d;
                        }
                    }

                    resolve({
                        status: "success",
                        result: deletedData
                    })

                } else {
                    resolve({
                        status: "error",
                        message: "No Data Found."
                    })
                }

            } else {
                resolve(data)
            }
        })
    }
}