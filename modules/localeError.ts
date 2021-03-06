import { exit } from "process";

let colors = require("colors");

export = class LocaleError {

    data: LocaleErrorDataInterface = {};

    constructor(data: LocaleErrorDataInterface) {

        this.data.error = data.error;
        this.data.timestamp = Date.now();
        this.data.log = data.log == undefined ? true : data.log

        if (this.data.log) {
            this.show();
        }

        if (this.data.exit) {
            exit()
        }
    }

    show() {
        console.error(colors.red(this.data.error));
    }


}