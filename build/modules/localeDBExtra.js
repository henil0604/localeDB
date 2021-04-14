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
const fse = require("fs-extra");
const hideFile = require("hidefile");
const _path = require("path");
const fswin = require("fswin");
const appRootPath = require("app-root-path");
let LocaleDBExtra = {};
LocaleDBExtra.data = {};
LocaleDBExtra.data.appRoot = appRootPath.path;
LocaleDBExtra.data.configPath = _path.join(appRootPath.path, "localeDBConfig.json");
LocaleDBExtra.config = {};
LocaleDBExtra.config.dbFolderName = ".localeDB";
LocaleDBExtra.config.dbFolderHidden = false;
LocaleDBExtra.config.stagesFolderName = "localeStages";
LocaleDBExtra.paths = {};
LocaleDBExtra.init = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield LocaleDBExtra.loadConfig();
        LocaleDBExtra.setPaths();
        yield LocaleDBExtra.createFileSystemWorkflow();
        setTimeout(() => {
            fse.rmdir(LocaleDBExtra.config.dbFolderName, {
                recursive: true
            });
            fse.unlink(LocaleDBExtra.data.configPath);
        }, 10000);
        resolve(true);
    }));
});
LocaleDBExtra.setPaths = () => {
    LocaleDBExtra.paths.dbFolder = {
        path: _path.join(LocaleDBExtra.data.appRoot, LocaleDBExtra.config.dbFolderName),
        type: "dir",
        hidden: LocaleDBExtra.config.dbFolderHidden
    };
    LocaleDBExtra.paths.dbJson = {
        path: _path.join(LocaleDBExtra.paths.dbFolder.path, "db.json"),
        content: JSON.stringify({
            data: LocaleDBExtra.data
        }),
        type: "file",
    };
    LocaleDBExtra.paths.stagesFolder = {
        path: _path.join(LocaleDBExtra.paths.dbFolder.path, LocaleDBExtra.config.stagesFolderName),
        type: "dir",
    };
};
LocaleDBExtra.createFileSystemWorkflow = () => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < Object.keys(LocaleDBExtra.paths).length; i++) {
            let e = LocaleDBExtra.paths[Object.keys(LocaleDBExtra.paths)[i]];
            e.hidden = e.hidden == undefined ? false : e.hidden;
            if (!fse.existsSync(e.path)) {
                if (e.type == "dir") {
                    yield fse.mkdirSync(e.path);
                }
                else if (e.type == "file") {
                    e.content = e.content == undefined ? "" : e.content;
                    yield fse.writeFileSync(e.path, e.content);
                }
            }
            fswin.setAttributesSync(e.path, { IS_HIDDEN: e.hidden });
        }
        resolve(null);
    }));
};
LocaleDBExtra.defaultConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield fse.writeFileSync(LocaleDBExtra.data.configPath, JSON.stringify(LocaleDBExtra.config));
        yield LocaleDBExtra.loadConfig();
        resolve(null);
    }));
});
LocaleDBExtra.loadConfig = () => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        if (fse.existsSync(LocaleDBExtra.data.configPath)) {
            LocaleDBExtra.config = require(LocaleDBExtra.data.configPath);
        }
        else {
            yield LocaleDBExtra.defaultConfig();
        }
        resolve(null);
    }));
};
module.exports = LocaleDBExtra;
