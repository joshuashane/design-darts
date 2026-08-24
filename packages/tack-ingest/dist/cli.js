"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const merge_js_1 = require("./merge.js");
const sort_js_1 = require("./sort.js");
const report_js_1 = require("./report.js");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function parseArgs() {
    const args = process.argv.slice(2);
    const get = (flag) => {
        const i = args.indexOf(flag);
        return i !== -1 ? args[i + 1] : undefined;
    };
    const dir = get('--dir') ?? '.';
    const output = get('--output');
    return { dir: path.resolve(dir), output: output ? path.resolve(output) : undefined };
}
async function main() {
    const { dir, output } = parseArgs();
    console.error(`Reading feedback JSON from: ${dir}`);
    const merged = (0, merge_js_1.mergeFiles)(dir);
    console.error(`Loaded ${merged.length} comments from ${dir}`);
    const sorted = (0, sort_js_1.sortComments)(merged);
    const report = (0, report_js_1.generateReport)(sorted);
    if (output) {
        fs.writeFileSync(output, report, 'utf-8');
        console.error(`Triage report written to: ${output}`);
    }
    else {
        process.stdout.write(report);
    }
}
main().catch(err => { console.error(err); process.exit(1); });
