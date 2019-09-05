"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function log(message) {
    console.log(`\x1b[36m${message}\x1b[0m`);
}
exports.log = log;
function exists(file) {
    try {
        return fs.statSync(file) != null;
    }
    catch (e) {
        return false;
    }
}
exports.exists = exists;
function readBuffer(file) {
    if (!exists(file))
        return null;
    return fs.readFileSync(file);
}
exports.readBuffer = readBuffer;
function read(file) {
    let buffer = readBuffer(file);
    return buffer != null ? buffer.toString() : null;
}
exports.read = read;
function isFile(file) {
    let stats = fs.statSync(file);
    return stats && stats.isFile();
}
exports.isFile = isFile;
function isDirectory(file) {
    let stats = fs.statSync(file);
    return stats && stats.isDirectory();
}
exports.isDirectory = isDirectory;
function getFilesRecursiveInternal(root = __dirname, match = /./, directory = root, files = []) {
    for (let name of fs.readdirSync(directory)) {
        let fullname = path.join(directory, name);
        let stats = fs.statSync(fullname);
        if (stats.isFile()) {
            let relative = path.relative(root, fullname);
            if (match.test(relative)) {
                files.push(relative);
            }
        }
        else if (stats.isDirectory()) {
            getFilesRecursiveInternal(root, match, fullname, files);
        }
    }
    return files;
}
function getFilesRecursive(root = __dirname, match = /./) {
    return getFilesRecursiveInternal(root, match);
}
exports.getFilesRecursive = getFilesRecursive;
function findInFilesRecursive(textMatch, fileMatch = /./, dir = __dirname) {
    let foundFiles = [];
    for (let file of getFilesRecursive(dir, fileMatch)) {
        let fullpath = path.join(dir, file);
        let content = read(fullpath);
        if (content != null && textMatch.test(content)) {
            foundFiles.push(fullpath);
        }
    }
    return foundFiles;
}
exports.findInFilesRecursive = findInFilesRecursive;
