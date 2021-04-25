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

## Usage
```js
// Creating Connection to Database
let conn = await localeDb.ConnectDb("MyDatabase");

// Creating Stage
await conn.createStage("Users");

// Connecting to Stage
let Stage_Users = await conn.ConnectStage("Users"); // Creates Stages if Doesn't Exists

// Adding Data to Stage
let user1 = await Stage_Users.addData({
     username: "henil0604",
     email: "myemail@email.com",
     password: "itsSecret",
     dataId: "r4U8c3EqH1qE0S17miGD" // Optional, Generates Automatic If Doesn't Provided
})

// Getting Data By it's dataId
let gotUser = await Stage_Users.getDataById(user1.dataId);

// Update Data By it's dataId
let updateUser = await Stage_Users.updateData(user1.dataId, {
     verified: true
})

// Deleting Data By It's dataId
let deletedUser = await Stage_Users.deleteDataById(user1.dataId);

// Clearing All Data in Stage
await Stage_Users.clear();

// deleting Stage
await conn.deleteStage("Users");

// checking if Stage Exists
await conn.isStageExists("Users"); // false

// deleting Database
await localeDb.deleteDB("MyDatabase");

// checking if Database Exists
await localeDb.isDBExists("MyDatabase") // false

```
