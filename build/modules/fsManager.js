"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let fs = require("fs");
let _path = require("path");
let fsManager = {};
fsManager.createFile = (path, content, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        options = options == undefined ? (options = {}) : options;
        options.root =
            options.root == undefined
                ? _path.dirname(require.main.filename)
                : options.root;
        if (Array.isArray(path) && !Array.isArray(content)) {
            content = [];
            for (let i = 0; i < path.length; i++) {
                content.push("");
            }
        }
        content = content == undefined ? (content = "") : content;
        if (Array.isArray(path)) {
            let toResolve = [];
            for (let i = 0; i < path.length; i++) {
                toResolve.push(yield fsManager.createFile(path[i], content[i]));
            }
            resolve(toResolve);
        }
        else {
            path = _path.join(options.root, path);
            fs.writeFile(path, content, function (err) {
                let obj = {};
                obj.err = err;
                resolve(obj);
            });
        }
    }));
});
fsManager.deleteFile = (path, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        options = options == undefined ? (options = {}) : options;
        options.root =
            options.root == undefined
                ? _path.dirname(require.main.filename)
                : options.root;
        if (Array.isArray(path)) {
            let toResolve = [];
            for (let i = 0; i < path.length; i++) {
                toResolve.push(yield fsManager.deleteFile(path[i]));
            }
            resolve(toResolve);
        }
        else {
            path = _path.join(options.root, path);
            fs.unlink(path, (err) => {
                let obj = {};
                obj.err = err;
                resolve(obj);
            });
        }
    }));
});
fsManager.mkDir = (path, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        options = options == undefined ? (options = {}) : options;
        options.root =
            options.root == undefined
                ? _path.dirname(require.main.filename)
                : options.root;
        if (Array.isArray(path)) {
            let toResolve = [];
            for (let i = 0; i < path.length; i++) {
                toResolve.push(yield fsManager.mkDir(path[i]));
            }
            resolve(toResolve);
        }
        else {
            path = _path.join(options.root, path);
            fs.mkdir(path, (err) => {
                let obj = {};
                obj.err = err;
                resolve(obj);
            });
        }
    }));
});
module.exports = fsManager;
