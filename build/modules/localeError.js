"use strict";
const process_1 = require("process");
let colors = require("colors");
module.exports = class LocaleError {
    constructor(data) {
        this.data = {};
        this.data.error = data.error;
        this.data.timestamp = Date.now();
        this.data.log = data.log == undefined ? true : data.log;
        if (this.data.log) {
            this.show();
        }
        if (this.data.exit) {
            process_1.exit();
        }
    }
    show() {
        console.error(colors.red(this.data.error));
    }
};
