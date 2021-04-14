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
}

interface LocaleDBExtraPathsInterface {
  dbFolder?: LocaleDBPathInterface;
  stagesFolder?: LocaleDBPathInterface;
  dbJson?: LocaleDBPathInterface;
}

interface LocaleDBConfig {
  dbFolderName?: string;
  dbFolderHidden?: boolean;
  stagesFolderName?: string;
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
