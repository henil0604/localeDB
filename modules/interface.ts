interface LocaleDBInterface {
    ConnectDb?: Function;
    createDB?: Function;
    isDBExists?: Function;
    init?: Function;
    deleteDB?: Function;
    _initialized?: boolean;
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
    _initialized?: boolean;
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
    _initialized?: boolean;
    dbName?: string;
    _temp?: object;
    info?: any;
    _paths?: LocaleDBClassesDBPaths;
    init?: Function;
    getDbInfo?: Function;
    refreshDbInfo?: Function;
    isStageExists?: Function;
    createStage?: Function;
    ConnectStage?: Function;
    _updateTimestamps
}

interface LocaleDBClassesDBPaths {
    db?: string;
    jsonFile?: string;
    stages?: string;
}

interface LocaleDBPromiseDefaultResponse {
    status: string;
    message?: any;
    result?: any;
}

interface LocaleDBClassesStage {
    _initialized: boolean;
    dbName: string;
    stageName: string;
    _dbInfo: object;
    _stageInfo: object;
    _paths: LocaleDBClassesStagePaths;
    init: Function;
    data: object;
    getDbInfo: Function;
    getStageInfo: Function;
    addData: Function;
    getAllData: Function;
    deleteDataById: Function;
    getDataById: Function;
    clear: Function;
    updateDataById: Function;
    updateData: Function;
    _updateTimestamps: Function;
}

interface LocaleDBClassesStagePaths {
    db?: string;
    dbJsonFile?: string;
    stages?: string;
    stageFolder?: string;
    stageJsonFile?: string;
    stageDataJson?: string;
}