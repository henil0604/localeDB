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
let snet_core = require("snet_core");
const LocaleDBExtra = require("../localeDBExtra");
const LocaleError = require("../localeError");
let path = require("path");
require("../interface");
require("../../modules/interface");
module.exports = class DB {
    constructor(dbName) {
        this._paths = {};
        this.dbName = dbName;
        this._temp = {};
        this.info = {};
        this._paths.db = path.join(LocaleDBExtra.paths.dbsFolder.path, this.dbName);
        this._paths.jsonFile = path.join(this._paths.db, 'db.json');
        this._paths.stages = path.join(this._paths.db, 'stages/');
    }
    init() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield LocaleDBExtra.init();
            this.info = yield this.getDbInfo();
            resolve(this);
        }));
    }
    getDbInfo() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let path = `${LocaleDBExtra.paths.dbsFolder.path}/${this.dbName}/db.json`;
            let data = require(path);
            resolve(data);
        }));
    }
    refreshDbInfo() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            this.info = yield this.getDbInfo();
            resolve(this.info);
        }));
    }
    isStageExists(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let folderExists = yield snet_core.fs.isExist(path.join(this._paths.stages, stageName));
            let stageJsonFileExists = yield snet_core.fs.isExist(path.join(this._paths.stages, stageName, "stage.json"));
            resolve(folderExists && stageJsonFileExists);
        }));
    }
    createStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isStageExists(stageName))) {
                let stageFolder = path.join(this._paths.stages, stageName);
                yield snet_core.fs.createDir(stageFolder);
                let stageJsonFile = path.join(stageFolder, "stage.json");
                yield snet_core.fs.createFile(stageJsonFile);
                let stageJsonObj = {
                    dbName: this.dbName,
                    stageName: stageName,
                    timestamp: Date.now(),
                    lastModified: Date.now(),
                    dataFilePath: path.join(stageFolder, "data.json"),
                    stageId: snet_core.utils.randomToken(20)
                };
                yield snet_core.fs.writeFile(stageJsonFile, JSON.stringify(stageJsonObj));
                yield snet_core.fs.createFile(path.join(stageFolder, "data.json"));
                yield snet_core.fs.writeFile(path.join(stageFolder, "data.json"), JSON.stringify({
                    data: []
                }));
                let updateDbJsonFile = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
                updateDbJsonFile.data.stages.push(stageJsonObj);
                updateDbJsonFile.update();
                yield this._updateTimestamps();
                this.refreshDbInfo();
                resolve({
                    status: "success",
                    message: "Successfuly Created Stage"
                });
            }
            else {
                this.refreshDbInfo();
                resolve(new LocaleError({
                    error: "Stage Already Exists",
                    log: false
                }));
            }
        }));
    }
    deleteStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.isStageExists(stageName)) {
                let stageFolder = path.join(this._paths.stages, stageName);
                yield snet_core.fs.deleteDir(stageFolder);
                let updateDbFile = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
                for (let i = 0; i < updateDbFile.data.stages.length; i++) {
                    let stage = updateDbFile.data.stages[i];
                    if (stage.stageName == stageName) {
                        updateDbFile.data.stages.splice(i, 1);
                    }
                }
                updateDbFile.update();
                yield this._updateTimestamps();
                resolve({
                    status: "success",
                    result: "Successfuly Deleted Stage"
                });
            }
            else {
                resolve(new LocaleError({
                    error: "No Stage Found",
                    log: false
                }));
            }
        }));
    }
    addData(stageName, data, _checkStageExists = true) {
        if (stageName == undefined || data == undefined || _checkStageExists == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.isStageExists(stageName)) {
                data.dataId = snet_core.utils.randomToken(20);
                let dataFile = path.join(this._paths.stages, stageName, "data.json");
                let update = LocaleDBExtra.utils.updateJsonFile(dataFile);
                update.data.data.push(data);
                update.update();
                yield this._updateTimestamps(stageName);
                resolve(data);
            }
            else {
                yield this.createStage(stageName);
                resolve(yield this.addData(stageName, data, true));
            }
        }));
    }
    getStageData(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.isStageExists(stageName)) {
                let dataFile = path.join(this._paths.stages, stageName, "data.json");
                let data = require(dataFile).data;
                resolve({
                    status: "success",
                    result: data
                });
            }
            else {
                resolve({
                    status: "error",
                    message: "Stage Does not Exists"
                });
            }
        }));
    }
    deleteDataById(stageName, dataId) {
        if (stageName == undefined || dataId == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getStageData(stageName);
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
                            update.update();
                            yield this._updateTimestamps(stageName);
                            deletedData = d;
                        }
                    }
                    resolve({
                        status: "success",
                        result: deletedData
                    });
                }
                else {
                    resolve({
                        status: "error",
                        message: "No Data Found."
                    });
                }
            }
            else {
                resolve(data);
            }
        }));
    }
    getDataById(stageName, dataId) {
        if (stageName == undefined || dataId == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getStageData(stageName);
            if (data.status == "success") {
                if (data.result.length > 0) {
                    for (let i = 0; i < data.result.length; i++) {
                        let d = data.result[i];
                        if (d.dataId == dataId) {
                            resolve({
                                status: "success",
                                result: d
                            });
                        }
                    }
                }
                else {
                    resolve({
                        status: "error",
                        message: "No Data Found."
                    });
                }
            }
            else {
                resolve(data);
            }
        }));
    }
    clearStage(stageName) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let stageDataJsonPath = path.join(this._paths.stages, stageName, "data.json");
            let update = LocaleDBExtra.utils.updateJsonFile(stageDataJsonPath);
            update.data.data = [];
            update.update();
        }));
    }
    _updateTimestamps(stageName = null) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (stageName != null) {
                let updateStageJsonLastModified = LocaleDBExtra.utils.updateJsonFile(path.join(this._paths.stages, stageName, "stage.json"));
                updateStageJsonLastModified.data.lastModified = Date.now();
                updateStageJsonLastModified.update();
            }
            let updateDbJsonLastModified = LocaleDBExtra.utils.updateJsonFile(this._paths.jsonFile);
            updateDbJsonLastModified.data.lastModified = Date.now();
            updateDbJsonLastModified.update();
            resolve({
                status: "success",
                message: "Successfuly Updated Timestamp"
            });
        }));
    }
};
