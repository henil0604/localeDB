let snet_core = require("snet_core");
import LocaleDBExtra = require("../localeDBExtra");
import LocaleError = require("../localeError");
let path = require("path")
let Stage = require("./stage");
require("../interface");

require("../../modules/interface");
export = class DB implements LocaleDBClassesDB {
    dbName: string;
    _temp: object;
    info: any;
    _paths: LocaleDBClassesDBPaths = {};
    _initialized: boolean;

    constructor(dbName) {
        this._initialized = false;
        this.dbName = dbName;
        this._temp = {}
        this.info = {}

        this._paths.db = path.join(LocaleDBExtra.paths.dbsFolder.path, this.dbName);
        this._paths.jsonFile = path.join(this._paths.db, 'db.json');
        this._paths.stages = path.join(this._paths.db, 'stages/');

    }

    init() {
        return new Promise(async resolve => {
            if (this._initialized == false || LocaleDBExtra._initialized == false) {
                await LocaleDBExtra.init()
                this.info = await this.getDbInfo();
            }

            this._initialized = true;
            resolve(this);
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
            await this.init();

            this.info = await this.getDbInfo();

            resolve(this.info)
        })
    }

    isStageExists(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {
            await this.init();

            let folderExists = await snet_core.fs.isExist(path.join(this._paths.stages, stageName));
            let stageJsonFileExists = await snet_core.fs.isExist(path.join(this._paths.stages, stageName, "stage.json"));

            resolve(folderExists && stageJsonFileExists);
        })
    }

    createStage(stageName): Promise<LocaleDBClassesStage | null> {
        return new Promise(async resolve => {
            if (stageName == undefined) {
                return null;
            }
            await this.init();

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
                delete stageJsonObj.lastModified;
                updateDbJsonFile.data.stages.push(stageJsonObj);
                updateDbJsonFile.update()

                await this._updateTimestamps()

                this.refreshDbInfo()
                let stageConnection = await this.ConnectStage(stageName);
                resolve(stageConnection)

            } else {
                this.refreshDbInfo()
                let stageConnection = await this.ConnectStage(stageName);
                resolve(stageConnection)
            }
        })
    }

    deleteStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise(async resolve => {
            await this.init();

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

                await this._updateTimestamps()

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

    _updateTimestamps(stageName: string | null = null): Promise<LocaleDBPromiseDefaultResponse> {
        return new Promise(async resolve => {
            await this.init();

            if (stageName != null) {
                let updateStageJsonLastModified = LocaleDBExtra.utils.updateJsonFile(path.join(this._paths.stages, stageName, "stage.json"));
                updateStageJsonLastModified.data.lastModified = Date.now()
                updateStageJsonLastModified.update()
            }

            let updateDbJsonLastModified = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
            updateDbJsonLastModified.data.lastModified = Date.now()
            updateDbJsonLastModified.update()

            resolve({
                status: "success",
                message: "Successfuly Updated Timestamp"
            })
        })
    }

    ConnectStage(stageName: string): Promise<LocaleDBClassesStage> {
        return new Promise(async resolve => {
            await this.init()

            if (!await this.isStageExists(stageName)) {
                await this.createStage(stageName);
            }

            let stageInstanse = new Stage(this.dbName, stageName);
            await stageInstanse.init();

            resolve(stageInstanse);

        })
    }

}