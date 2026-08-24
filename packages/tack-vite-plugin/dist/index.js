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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tackVitePlugin = tackVitePlugin;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
// @ts-expect-error no types
const generator_1 = __importDefault(require("@babel/generator"));
/**
 * Stamps data-tack-src="src/Foo.tsx:42" onto JSX elements during review builds.
 * Strip from production builds by NOT including this plugin in the production vite config.
 *
 * Usage in vite.config.ts (review builds only):
 *   import { tackVitePlugin } from '@tack/vite-plugin';
 *   plugins: [react(), tackVitePlugin()]
 */
function tackVitePlugin() {
    return {
        name: 'tack-vite-plugin',
        enforce: 'pre',
        transform(code, id) {
            // Only process JSX/TSX files
            if (!/\.[jt]sx$/.test(id))
                return null;
            // Skip node_modules
            if (id.includes('node_modules'))
                return null;
            let ast;
            try {
                ast = (0, parser_1.parse)(code, {
                    sourceType: 'module',
                    plugins: ['jsx', 'typescript'],
                });
            }
            catch {
                // If Babel can't parse it, leave it alone
                return null;
            }
            // Track whether we modified the AST
            let modified = false;
            // Use the repo root as the base for relative paths
            const repoRoot = process.cwd();
            const relPath = id.startsWith(repoRoot) ? id.slice(repoRoot.length + 1) : id;
            (0, traverse_1.default)(ast, {
                JSXOpeningElement(path) {
                    const loc = path.node.loc;
                    if (!loc)
                        return;
                    const srcAttr = `${relPath}:${loc.start.line}`;
                    // Don't stamp if already present
                    const existing = path.node.attributes.find(attr => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: 'data-tack-src' }));
                    if (existing)
                        return;
                    path.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('data-tack-src'), t.stringLiteral(srcAttr)));
                    modified = true;
                },
            });
            if (!modified)
                return null;
            const output = (0, generator_1.default)(ast, { retainLines: true }, code);
            return { code: output.code, map: output.map };
        },
    };
}
