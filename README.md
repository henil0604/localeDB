# LocaleDb

LocaleDb is Npm Package which can make your Local Storage System in Database. It works Fine for JSON Data.

## Installation
```js
npm i localedb
```

## Importation
```js
let localeDb = require("localedb");
```

## Initialization
```js
await localeDb.init();
```
This Initialization Will Generate All kind of Files and Folders in Your File System.


## Usage
```js
// Creating Connection to Database
let conn = await localeDb.ConnectDb("MyDatabase");

// Initializing Connection
await conn.init();

// Creating Stage 
await conn.createStage("users");

// Adding Data to Stage
let User = conn.addData("users", {
    username: "Henil",
    email: "myemail@email.com",
    password: "itsSecret"
})

// Getting All Data From Stage
let allUsers = conn.getStageData("users");

// Getting Data by dataId From Stage
let user1 = conn.getDataById("users", User.dataId);

// Deleting Particular Data From Stage By It's Id
let user1Deleted = conn.deleteDataById("users", User.dataId);

// Delete Stage
await conn.deleteStage("users");

// Delete Database
await localeDb.deleteDB("MyDatabase");

// Checking if Database Exists
await localeDb.isDBExists("MyDatabase"); // false
```