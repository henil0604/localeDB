
const fse = require("fs-extra");
const _path = require("path");
const fswin = require("fswin");
const appRootPath = require("app-root-path");
let LocaleDBExtra: LocaleDBExtraInterface = {};

LocaleDBExtra._initialized = false;

LocaleDBExtra.data = {};
LocaleDBExtra.data.appRoot = appRootPath.path;
LocaleDBExtra.data.configPath = _path.join(
    appRootPath.path,
    "localeDBConfig.json"
);
LocaleDBExtra.config = {};
LocaleDBExtra.config.dbFolderName = ".localeDB";
LocaleDBExtra.config.dbFolderHidden = false;
LocaleDBExtra.config.dbsFolderName = "localeDBs";
LocaleDBExtra.utils = {};

LocaleDBExtra.paths = {};

LocaleDBExtra.init = async () => {
    return new Promise(async (resolve) => {
        if (LocaleDBExtra._initialized == false) {
            await LocaleDBExtra.loadConfig();

            LocaleDBExtra.setPaths();

            await LocaleDBExtra.createFileSystemWorkflow();
        }
        LocaleDBExtra._initialized = true;
        resolve(true);
    });
};

LocaleDBExtra.setPaths = () => {

    LocaleDBExtra.paths.dbFolder = {
        path: _path.join(
            LocaleDBExtra.data.appRoot,
            LocaleDBExtra.config.dbFolderName
        ),
        type: "dir",
        hidden: LocaleDBExtra.config.dbFolderHidden
    };

    LocaleDBExtra.paths.dbJson = {
        path: _path.join(
            LocaleDBExtra.paths.dbFolder.path,
            "db.json"
        ),
        content: JSON.stringify(
            {
                data: LocaleDBExtra.data,
                dbs: []
            }
        ),
        type: "file",
    }

    LocaleDBExtra.paths.dbsFolder = {
        path: _path.join(
            LocaleDBExtra.paths.dbFolder.path,
            LocaleDBExtra.config.dbsFolderName
        ),
        type: "dir",
    };

};

LocaleDBExtra.createFileSystemWorkflow = () => {
    return new Promise(async (resolve) => {
        for (let i = 0; i < Object.keys(LocaleDBExtra.paths).length; i++) {
            let e: LocaleDBPathInterface =
                LocaleDBExtra.paths[Object.keys(LocaleDBExtra.paths)[i]];

            e.hidden = e.hidden == undefined ? false : e.hidden

            if (!fse.existsSync(e.path)) {
                if (e.type == "dir") {
                    await fse.mkdirSync(e.path);
                } else if (e.type == "file") {
                    e.content = e.content == undefined ? "" : e.content;
                    await fse.writeFileSync(e.path, e.content);
                }
            }

            fswin.setAttributesSync(e.path, { IS_HIDDEN: e.hidden });
        }

        resolve(null);
    });
};

LocaleDBExtra.defaultConfig = async () => {
    return new Promise(async (resolve) => {
        await fse.writeFileSync(
            LocaleDBExtra.data.configPath,
            JSON.stringify(LocaleDBExtra.config)
        );

        await LocaleDBExtra.loadConfig();
        resolve(null);
    });
};

LocaleDBExtra.loadConfig = () => {
    return new Promise(async (resolve) => {
        if (fse.existsSync(LocaleDBExtra.data.configPath)) {
            LocaleDBExtra.config = require(LocaleDBExtra.data.configPath);
        } else {
            await LocaleDBExtra.defaultConfig();
        }

        resolve(null);
    });
};

LocaleDBExtra.getDBdata = (): object => {
    return require(LocaleDBExtra.paths.dbJson.path);
}

LocaleDBExtra.updateDbData = () => {
    let data = LocaleDBExtra.getDBdata();
    return {
        data: data,
        update: function () {
            if (LocaleDBExtra.utils.isJsonStrigyfied(data)) {
                fse.writeFileSync(LocaleDBExtra.paths.dbJson.path, data)
            } else {
                fse.writeFileSync(LocaleDBExtra.paths.dbJson.path, JSON.stringify(data))
            }
        }
    };
}

LocaleDBExtra.utils.delayer = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(null);
        }, ms);
    })
}

LocaleDBExtra.utils.updateJsonFile = (path) => {
    let data = require(path);
    return {
        data: data,
        update: function () {
            if (LocaleDBExtra.utils.isJsonStrigyfied(data)) {
                fse.writeFileSync(path, data)
            } else {
                fse.writeFileSync(path, JSON.stringify(data))
            }
        }
    };
}

LocaleDBExtra.utils.isJsonStrigyfied = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



export = LocaleDBExtra
