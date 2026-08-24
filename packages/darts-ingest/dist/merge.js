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
exports.mergeFiles = mergeFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const hash_js_1 = require("./hash.js");
function makeDedupKey(cssSelector, reviewerName, text) {
    return `${cssSelector}::${reviewerName}::${(0, hash_js_1.contentHash)(text)}`;
}
function isStoragePayload(obj) {
    return typeof obj === 'object' && obj !== null && 'schemaVersion' in obj;
}
function normalizeComment(raw, prototypeId, prototypeName) {
    const id = typeof raw['id'] === 'string' ? raw['id'] : null;
    const text = typeof raw['text'] === 'string' ? raw['text'] : '';
    if (!id || !text)
        return null;
    const reviewer = raw['reviewer'] && typeof raw['reviewer'] === 'object'
        ? raw['reviewer']
        : { name: 'Unknown' };
    const anchorData = raw['anchorData'] && typeof raw['anchorData'] === 'object'
        ? raw['anchorData']
        : {};
    const cssSelector = typeof anchorData['cssSelector'] === 'string' ? anchorData['cssSelector'] : '';
    const xpath = typeof anchorData['xpath'] === 'string' ? anchorData['xpath'] : '';
    const textSnippet = typeof anchorData['textSnippet'] === 'string' ? anchorData['textSnippet'] : '';
    const pathname = typeof anchorData['pathname'] === 'string' ? anchorData['pathname'] : '/';
    const screenState = typeof anchorData['screenState'] === 'string' ? anchorData['screenState'] : undefined;
    const viewport = anchorData['viewport'] && typeof anchorData['viewport'] === 'object'
        ? anchorData['viewport']
        : { width: 0, height: 0, dpr: 1 };
    const sourceLocation = typeof anchorData['sourceLocation'] === 'string' ? anchorData['sourceLocation'] : undefined;
    return {
        id,
        text,
        reviewer,
        cssSelector,
        xpath,
        textSnippet,
        pathname,
        screenState,
        viewport,
        status: raw['status'] === 'resolved' ? 'resolved' : 'open',
        anchorStatus: raw['anchorStatus'] === 'orphaned' ? 'orphaned' : 'resolved',
        createdAt: typeof raw['createdAt'] === 'number' ? raw['createdAt'] : 0,
        prototypeId,
        prototypeName,
        sourceLocation,
        dedupKey: makeDedupKey(cssSelector, reviewer.name, text),
    };
}
function mergeFiles(dir) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const seen = new Set();
    const result = [];
    for (const file of files) {
        let payload;
        try {
            payload = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        }
        catch {
            console.error(`Skipping invalid JSON: ${file}`);
            continue;
        }
        if (!isStoragePayload(payload)) {
            console.error(`Skipping non-tack JSON: ${file}`);
            continue;
        }
        const prototypeId = payload.prototypeId ?? 'unknown';
        const prototypeName = payload.prototypeName ?? 'Unknown Prototype';
        const comments = Array.isArray(payload.comments) ? payload.comments : [];
        for (const raw of comments) {
            if (!raw || typeof raw !== 'object')
                continue;
            const normalized = normalizeComment(raw, prototypeId, prototypeName);
            if (!normalized)
                continue;
            if (seen.has(normalized.dedupKey))
                continue;
            seen.add(normalized.dedupKey);
            result.push(normalized);
        }
    }
    return result;
}
