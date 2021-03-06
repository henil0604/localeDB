var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const localeDb = require("../index");
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let conn = yield localeDb.ConnectDb("MyDatabase");
        yield conn.createStage("Users");
        let Stage_Users = yield conn.ConnectStage("Users");
        let user1 = yield Stage_Users.addData({
            username: "henil0604",
            email: "myemail@email.com",
            password: "itsSecret",
            dataId: "r4U8c3EqH1qE0S17miGD"
        });
        let gotUser = yield Stage_Users.getDataById(user1.dataId);
        let updateUser = yield Stage_Users.updateDataById(user1.dataId, {
            verified: true
        });
        let updatedUserByUsername = yield Stage_Users.updateData({
            username: "henil0604"
        }, {
            username: 'henil'
        });
        let allUsers = yield Stage_Users.getAllData();
        console.log(allUsers.result);
        let deletedUser = yield Stage_Users.deleteDataById(user1.dataId);
        yield Stage_Users.clear();
        yield conn.deleteStage("Users");
        yield conn.isStageExists("Users");
        yield localeDb.deleteDB("MyDatabase");
        yield localeDb.isDBExists("MyDatabase");
    });
}
test();
