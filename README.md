# LocaleDb

LocaleDb can Convert Your Locale Project Storage Into a Database

## Installation

```js
npm install localedb
```

## Importation
```js
let localeDb = require("localedb");
```
___

## Usage

Most of Functions are Promised Based So be aware to use it outside of async Functions.
___
#### Creating Database

```js
let conn = await localeDb.createDB("MyDatabase");
```
- ```localeDb.createDB(dbName)``` Creates Database In our Project Folder.
- ```dbName``` takes String of Database Name You want to Create.
- Returns Connections Object.

#### Connection to Already Created Database

```js
let conn = await localeDb.ConnectDb("MyDatabase");
```
- ```localeDb.ConnectDb(dbName)``` Connect to the Database.
- ```dbName``` takes String of Database Name You want to Connect.
- Returns Conection Object.

#### Deleting Database
```js
await localeDb.deleteDB("MyDatabase");
```
- ```localeDb.deleteDB(dbName)``` Delete The Database.
- Returns ```LocaleDBPromiseDefaultResponse``` 

#### Checking If Database Exists
```js
await localeDb.isDBExists("MyDatabase");
```
- ```localeDb.isDBExists(dbName)``` Checks if Database Exists or Not.
- Returns ```boolean```.

___

### Db Connection Object
```Db Connection Object``` Can Be Accessed by ```localeDb.ConnectDb(dbName)```.

```js
let conn = await localeDb.Connect(dbName);
```
- Returns ```Db Connection Object```

#### Usage
------------
##### Getting Database Info
```js
await conn.getDbInfo();
```
- Returns ```JSON``` Object Containing Database Information.

##### Creating Stage
```js
await conn.createStage(stageName);
```
- Takes ```stageName``` argument as the Name of the Stage Inside The Database.
- Returns ```Stage Connection Object```.

##### Connecting To Stage
```js
let stage = await conn.ConnectStage(stageName);
```
- Creates Stage if Does not Exists.
- Returns ```Stage Connection Object```.

##### Checking If Stage Exists
```js
await conn.isStageExists(stageName);
```
- Returns ```boolean```.

##### Deleting Stage
```js
await conn.deleteStage(stageName)
```
- Returns ```LocaleDBPromiseDefaultResponse```.

---
### Stage Connection Object

```Stage Connection Object``` Can Be Accessed by ```conn.ConnectStage(stageName)```.

```js
let stage = await conn.ConnectStage(stageName);
```
- Returns ```Stage Connection Object```

#### Usage
------------

##### Getting Parent Db Info
```js
await stage.getDbInfo();
```
- Returns ```JSON``` Object Containing Database Info.

##### Getting Stage Info
```js
await stage.getStageInfo();
```
- Returns ```JSON``` Object Containing Stage Info.

##### Adding Data To Stage
```js
await stage.addData(data);
```
- Takes ```JSON``` Object.
- Automatically Add ```dataId``` Key If Not Provided to Given Data and Value Will be Unique.
- Returns ```LocaleDBPromiseDefaultResponse``` Object.

##### Getting All Data From Stage
```js
await stage.getAllData();
```
- Returns ```LocaleDBPromiseDefaultResponse``` Containing ```result``` Array Of Data.

##### Getting Data Using ```dataId```
```js
await stage.getDataById(dataId);
```
- Takes ```dataId``` as the Unique Key Generated/Provided While Adding Data.
- Returns Single Object Or Array Of Object Containing Provided ```dataId```.

##### Deleting Data By Id
```js
await stage.deleteDataById(dataId);
```
- Returns Arrary Of Deleted Data.

##### Clearing All Data From Stage
```js
await stage.clear();
```
- Returns ```LocaleDBPromiseDefaultResponse``` Object.

##### Updating Data Using ```dataId```
```js
await stage.updateDataById(dataId, data);
```
- Takes Second Argument As the Data You Want to Update.
- Returns ```LocaleDBPromiseDefaultResponse``` Object Containing ```updated``` Array Inside ```result``` Object. 

##### Updating Data Using Keys
```js
await stage.updateData(compareData, updateData);
```
- Takes ```compareData``` As the Keys You Want to Compare with All Data
- If ```data``` matches ```compareData```'s Keys and it Values, The Keys of ```data``` Will be Updated/Added to ```data``` Corresponding to the Keys of ```updateData```.

___