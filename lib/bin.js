"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const common = __importStar(require("./common"));
const root = "./src";
const indexFileName = "index.ts";
function bin() {
    const [, , cmd] = process.argv;
    const commands = ["build", "watch"];
    if (commands.indexOf(cmd) == -1) {
        console.error("Unrecognized command.");
        console.error("Available commands: " + commands.join(", "));
    }
    const watch = cmd == "watch";
    let changed = false;
    let filenames = new Set();
    function generateIndex() {
        changed = false;
        let files = Array.from(filenames)
            .map(name => {
            let [path, ext] = name.split(".");
            path = path.replace("\\", "/");
            return { path, ext };
        }).filter(file => file.ext == "ts" && file.path != "index").map((file, i) => ({ path: file.path, symbol: "_" + i }));
        let indent = "    ";
        let _imports = files.map(file => `import * as ${file.symbol} from "./${file.path}"`).join("\n");
        let _exports = files.map(file => file.symbol).join(",\n" + indent);
        let file = _imports + "\n\nexport default {\n" + indent + _exports + "\n}";
        // console.log( file )
        let dest = path_1.default.join(root, indexFileName);
        fs_1.default.writeFileSync(dest, file, { encoding: "utf8" });
    }
    function checkFile(filename) {
        let justChanged = false;
        let filepath = path_1.default.join("./src", filename);
        if (common.exists(filepath)) {
            justChanged = !filenames.has(filename);
            filenames.add(filename);
        }
        else {
            justChanged = filenames.has(filename);
            filenames.delete(filename);
        }
        changed = changed || justChanged;
    }
    common.getFilesRecursive(root).map(filename => checkFile(filename));
    generateIndex();
    if (watch) {
        fs_1.default.watch(root, { recursive: true }, (eventType, filename) => {
            filename = filename.toString();
            let isFile = filename.indexOf(".") > -1;
            if (isFile) {
                checkFile(filename);
                if (changed)
                    generateIndex();
            }
        });
    }
}
exports.default = bin;
