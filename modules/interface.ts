interface LocaleDBInterface {
  Connection?: Function;
  createDB?: Function;
  isDBExists?: Function;
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
}

interface LocaleDBExtraPathsInterface {
  dbFolder?: LocaleDBPathInterface;
  dbsFolder?: LocaleDBPathInterface;
  dbJson?: LocaleDBPathInterface;
}

interface LocaleDBConfig {
  dbFolderName?: string;
  dbFolderHidden?: boolean;
  dbsFolder?: string;
}

interface LocaleDBExtraDataInterface {
  appRoot?: string;
  configPath?: string;
}

interface LocaleDBConnectionOptionsInterface {
  dbName: String;
  stageName: String;
}

interface LocaleDBConnection { }

interface LocaleDBPathInterface {
  path?: string;
  type?: "dir" | "file";
  content?: string;
  hidden?: boolean;
}
