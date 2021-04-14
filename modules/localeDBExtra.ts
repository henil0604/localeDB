const fse = require("fs-extra");
const hideFile = require("hidefile");
const _path = require("path");
const fswin = require("fswin");
const appRootPath = require("app-root-path");
let LocaleDBExtra: LocaleDBExtraInterface = {};

LocaleDBExtra.data = {};
LocaleDBExtra.data.appRoot = appRootPath.path;
LocaleDBExtra.data.configPath = _path.join(
    appRootPath.path,
    "localeDBConfig.json"
);
LocaleDBExtra.config = {};
LocaleDBExtra.config.dbFolderName = ".localeDB";
LocaleDBExtra.config.dbFolderHidden = false;
LocaleDBExtra.config.stagesFolderName = "localeStages";

LocaleDBExtra.paths = {};

LocaleDBExtra.init = async () => {
    return new Promise(async (resolve) => {
        await LocaleDBExtra.loadConfig();

        LocaleDBExtra.setPaths();

        await LocaleDBExtra.createFileSystemWorkflow();

        setTimeout(() => {
            fse.rmdir(LocaleDBExtra.config.dbFolderName, {
                recursive: true
            })
            fse.unlink(LocaleDBExtra.data.configPath)
        }, 10000);

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
                data: LocaleDBExtra.data
            }
        ),
        type: "file",
    }

    LocaleDBExtra.paths.stagesFolder = {
        path: _path.join(
            LocaleDBExtra.paths.dbFolder.path,
            LocaleDBExtra.config.stagesFolderName
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


export = LocaleDBExtra;
