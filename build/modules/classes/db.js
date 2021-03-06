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
let Stage = require("./stage");
require("../interface");
require("../../modules/interface");
module.exports = class DB {
    constructor(dbName) {
        this._paths = {};
        this._initialized = false;
        this.dbName = dbName;
        this._temp = {};
        this.info = {};
        this._paths.db = path.join(LocaleDBExtra.paths.dbsFolder.path, this.dbName);
        this._paths.jsonFile = path.join(this._paths.db, 'db.json');
        this._paths.stages = path.join(this._paths.db, 'stages/');
    }
    init() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this._initialized == false || LocaleDBExtra._initialized == false) {
                yield LocaleDBExtra.init();
                this.info = yield this.getDbInfo();
            }
            this._initialized = true;
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
            yield this.init();
            this.info = yield this.getDbInfo();
            resolve(this.info);
        }));
    }
    isStageExists(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            let folderExists = yield snet_core.fs.isExist(path.join(this._paths.stages, stageName));
            let stageJsonFileExists = yield snet_core.fs.isExist(path.join(this._paths.stages, stageName, "stage.json"));
            resolve(folderExists && stageJsonFileExists);
        }));
    }
    createStage(stageName) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (stageName == undefined) {
                return null;
            }
            yield this.init();
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
                delete stageJsonObj.lastModified;
                updateDbJsonFile.data.stages.push(stageJsonObj);
                updateDbJsonFile.update();
                yield this._updateTimestamps();
                this.refreshDbInfo();
                let stageConnection = yield this.ConnectStage(stageName);
                resolve(stageConnection);
            }
            else {
                this.refreshDbInfo();
                let stageConnection = yield this.ConnectStage(stageName);
                resolve(stageConnection);
            }
        }));
    }
    deleteStage(stageName) {
        if (stageName == undefined) {
            return null;
        }
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.init();
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
    _updateTimestamps(stageName = null) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.init();
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
    ConnectStage(stageName) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            if (!(yield this.isStageExists(stageName))) {
                yield this.createStage(stageName);
            }
            let stageInstanse = new Stage(this.dbName, stageName);
            yield stageInstanse.init();
            resolve(stageInstanse);
        }));
    }
};
