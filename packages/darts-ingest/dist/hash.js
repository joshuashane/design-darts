"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentHash = contentHash;
/** djb2-based hash — fast, no dependencies, good enough for dedup */
function contentHash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++)
        h = (h * 33) ^ s.charCodeAt(i);
    return (h >>> 0).toString(36);
}
