let snet_core = require("snet_core");
import LocaleDBExtra = require("../localeDBExtra");
import LocaleError = require("../localeError");
let path = require("path");

require("../../modules/interface");


export = class Stage implements LocaleDBClassesStage {
    dbName: string;
    stageName: string;
    _dbInfo: object;
    _stageInfo: object;
    _paths: LocaleDBClassesStagePaths;
    _initialized: boolean;
    data: object;

    constructor(dbName, stageName) {
        this._initialized = false;
        this._dbInfo = {};
        this._stageInfo = {};
        this.dbName = dbName;
        this.stageName = stageName;
        this._paths = {};
        this.data = {};

        this._paths.db = path.join(LocaleDBExtra.paths.dbsFolder.path, this.dbName);
        this._paths.dbJsonFile = path.join(this._paths.db, 'db.json');
        this._paths.stages = path.join(this._paths.db, 'stages/');
        this._paths.stageFolder = path.join(this._paths.stages, this.stageName);
        this._paths.stageJsonFile = path.join(this._paths.stageFolder, "stage.json");
        this._paths.stageDataJson = path.join(this._paths.stageFolder, "data.json");
    }

    init() {
        return new Promise(async resolve => {
            if (!this._initialized) {
                await LocaleDBExtra.init()
                this._dbInfo = await this.getDbInfo();
                this._stageInfo = await this.getStageInfo();
            }
            this._initialized = true;
            resolve(true)
        })
    }

    getDbInfo(): Promise<object> {
        return new Promise(async resolve => {

            let data = require(this._paths.dbJsonFile)

            resolve(data)
        })
    }

    getStageInfo(): Promise<object> {
        return new Promise(async resolve => {

            let data = require(this._paths.stageJsonFile);

            resolve(data)
        })
    }

    addData(data): Promise<LocaleDBPromiseDefaultResponse> {
        return new Promise(async resolve => {
            await this.init()

            data.dataId = data.dataId == undefined ? snet_core.utils.randomToken(20) : data.dataId;

            let dataFile = path.join(this._paths.stageDataJson);

            let update = LocaleDBExtra.utils.updateJsonFile(dataFile);
            update.data.data.push(data);
            update.update();

            await this._updateTimestamps()

            resolve(data)

        })
    }

    getAllData(): Promise<LocaleDBPromiseDefaultResponse> {
        return new Promise(async resolve => {
            this.init();
            let data = require(this._paths.stageDataJson)

            resolve({
                status: "success",
                result: data.data
            })
        })
    }

    getDataById(dataId) {
        return new Promise(async resolve => {
            this.init();

            let data = await this.getAllData();
            let foundData;

            for (let i = 0; i < data.result.length; i++) {
                let d = data.result[i];
                if (d.dataId == dataId) {
                    foundData = d;
                }
            }

            resolve(foundData);
        })
    }

    deleteDataById(dataId) {
        return new Promise(async resolve => {
            this.init();

            let data = await this.getAllData();
            let deletedData;

            for (let i = 0; i < data.result.length; i++) {
                let d = data.result[i];
                if (d.dataId == dataId) {
                    deletedData = d;
                    data.result.splice(i, 1);
                }
            }

            let update = LocaleDBExtra.utils.updateJsonFile(this._paths.stageDataJson);
            update.data.data = data.result;
            update.update();

            await this._updateTimestamps()

            resolve(deletedData);
        })
    }

    clear(): Promise<LocaleDBPromiseDefaultResponse> {
        return new Promise(async resolve => {
            await this.init();

            let update = LocaleDBExtra.utils.updateJsonFile(this._paths.stageDataJson);
            update.data.data = [];
            update.update()

            this._updateTimestamps()

            resolve({
                status: "success",
                message: "Successfuly Cleared Stage"
            })
        })
    }

    _updateTimestamps(): Promise<LocaleDBPromiseDefaultResponse> {

        return new Promise(async resolve => {
            await this.init();

            let updateStageJsonLastModified = LocaleDBExtra.utils.updateJsonFile(path.join(this._paths.stages, this.stageName, "stage.json"));
            updateStageJsonLastModified.data.lastModified = Date.now()
            updateStageJsonLastModified.update()

            let updateDbJsonLastModified = LocaleDBExtra.utils.updateJsonFile(this._paths.dbJsonFile);
            updateDbJsonLastModified.data.lastModified = Date.now()
            updateDbJsonLastModified.update()

            resolve({
                status: "success",
                message: "Successfuly Updated Timestamp"
            })
        })
    }
}