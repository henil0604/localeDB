interface LocaleDBInterface {
    ConnectDb?: Function;
    createDB?: Function;
    isDBExists?: Function;
    init?: Function;
    deleteDB?: Function;
}

interface LocaleDBExtraInterface {
    init?: Function;
    loadConfig?: Function;
    data?: LocaleDBExtraDataInterface;
    config?: LocaleDBConfig;
    defaultConfig?: Function;
    createFileSystemWorkflow?: Function;
    setPaths?: Function;
    paths?: LocaleDBExtraPathsInterface;
    getDBdata?: Function;
    updateDbData?: Function;
    utils?: LocaleDBExtraUtilsInterface;
}

interface LocaleDBExtraUtilsInterface {
    delayer?: Function;
    isJsonStrigyfied?: Function;
    updateJsonFile?: Function;
}

interface LocaleDBExtraPathsInterface {
    dbFolder?: LocaleDBPathInterface;
    dbsFolder?: LocaleDBPathInterface;
    dbJson?: LocaleDBPathInterface;
}

interface LocaleDBConfig {
    dbFolderName?: string;
    dbFolderHidden?: boolean;
    dbsFolderName?: string;
}

interface LocaleDBExtraDataInterface {
    appRoot?: string;
    configPath?: string;
}

interface LocaleDBPathInterface {
    path?: string;
    type?: "dir" | "file";
    content?: string;
    hidden?: boolean;
}

interface LocaleErrorDataInterface {
    error?: string | object;
    timestamp?: number;
    log?: boolean;
    exit?: boolean;
}

interface LocaleDBVarsClasses {
    DB?;
}
interface LocaleDBClassesDB {
    dbName?: string;
    _temp?: object;
    info?: any;
    _paths?: LocaleDBClassesDBPaths;
    init?: Function;
    getDbInfo?: Function;
    refreshDbInfo?: Function;
    isStageExists?: Function;
    createStage?: Function;
    deleteStage?: Function;
    addData?: Function;
    getStageData?: Function;
    deleteDataById?: Function;
    clearStage?: Function;
}

interface LocaleDBClassesDBPaths {
    db?: string;
    jsonFile?: string;
    stages?: string;
}

interface LocaleDBPromiseDefaultResponse {
    status: string;
    message?: any;
    result?: any[] | object[];
}