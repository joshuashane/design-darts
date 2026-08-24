import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
// @ts-expect-error no types
import generate from '@babel/generator';

/**
 * Stamps data-tack-src="src/Foo.tsx:42" onto JSX elements during review builds.
 * Strip from production builds by NOT including this plugin in the production vite config.
 *
 * Usage in vite.config.ts (review builds only):
 *   import { tackVitePlugin } from 'darts-vite-plugin';
 *   plugins: [react(), tackVitePlugin()]
 */
export function tackVitePlugin(): Plugin {
  return {
    name: 'darts-vite-plugin',
    enforce: 'pre',

    transform(code: string, id: string) {
      // Only process JSX/TSX files
      if (!/\.[jt]sx$/.test(id)) return null;
      // Skip node_modules
      if (id.includes('node_modules')) return null;

      let ast: ReturnType<typeof parse>;
      try {
        ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        });
      } catch {
        // If Babel can't parse it, leave it alone
        return null;
      }

      // Track whether we modified the AST
      let modified = false;
      // Use the repo root as the base for relative paths
      const repoRoot = process.cwd();
      const relPath = id.startsWith(repoRoot) ? id.slice(repoRoot.length + 1) : id;

      traverse(ast, {
        JSXOpeningElement(path) {
          const loc = path.node.loc;
          if (!loc) return;
          const srcAttr = `${relPath}:${loc.start.line}`;

          // Don't stamp if already present
          const existing = path.node.attributes.find(
            attr => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: 'data-tack-src' })
          );
          if (existing) return;

          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-tack-src'),
              t.stringLiteral(srcAttr)
            )
          );
          modified = true;
        },
      });

      if (!modified) return null;

      const output = generate(ast, { retainLines: true }, code);
      return { code: output.code, map: output.map };
    },
  };
}
