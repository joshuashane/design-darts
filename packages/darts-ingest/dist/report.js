"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
function formatViewport(vp) {
    return `${vp.width}×${vp.height}${vp.dpr !== 1 ? ` @${vp.dpr}x` : ''}`;
}
function groupByScreen(comments) {
    const groups = new Map();
    for (const c of comments) {
        const key = c.pathname + (c.screenState ? `::${c.screenState}` : '');
        if (!groups.has(key))
            groups.set(key, []);
        groups.get(key).push(c);
    }
    return groups;
}
function generateReport(comments) {
    const open = comments.filter(c => c.status === 'open').length;
    const resolved = comments.filter(c => c.status === 'resolved').length;
    const orphaned = comments.filter(c => c.anchorStatus === 'orphaned').length;
    const protoNames = [...new Set(comments.map(c => c.prototypeName))].join(', ');
    const lines = [
        `# Tack Triage Report`,
        ``,
        `**Prototype:** ${protoNames || 'Unknown'}`,
        `**Generated:** ${new Date().toISOString()}`,
        `**Total comments:** ${comments.length} (${open} open, ${resolved} resolved, ${orphaned} orphaned)`,
        ``,
        `---`,
        ``,
    ];
    const activeComments = comments.filter(c => c.anchorStatus !== 'orphaned');
    const orphanedComments = comments.filter(c => c.anchorStatus === 'orphaned');
    const groups = groupByScreen(activeComments);
    let commentIndex = 1;
    for (const [screenKey, screenComments] of groups) {
        const [pathname, screenState] = screenKey.split('::');
        lines.push(`## Screen: \`${pathname}\`${screenState ? ` — state: \`${screenState}\`` : ''}`);
        lines.push(`_${screenComments.length} comment${screenComments.length !== 1 ? 's' : ''}_`);
        lines.push('');
        for (const c of screenComments) {
            const statusIcon = c.anchorStatus === 'orphaned' ? '⚠️' : c.status === 'resolved' ? '✅' : '🔴';
            lines.push(`### ${statusIcon} Comment ${commentIndex++}`);
            lines.push('');
            lines.push(`**Reviewer:** ${c.reviewer.name}${c.reviewer.email ? ` <${c.reviewer.email}>` : ''}`);
            lines.push(`**Status:** ${c.anchorStatus === 'orphaned' ? 'orphaned (element not found)' : c.status}`);
            lines.push(`**Viewport:** ${formatViewport(c.viewport)}`);
            lines.push(`**Element:** \`${c.cssSelector}\``);
            if (c.sourceLocation)
                lines.push(`**Source:** \`${c.sourceLocation}\``);
            if (c.textSnippet)
                lines.push(`**Element text:** "${c.textSnippet}"`);
            lines.push('');
            lines.push(`> ${c.text.replace(/\n/g, '\n> ')}`);
            lines.push('');
        }
        lines.push('---');
        lines.push('');
    }
    if (orphanedComments.length > 0) {
        lines.push(`## ⚠️ Orphaned Comments (${orphanedComments.length})`);
        lines.push('');
        lines.push('These comments could not be re-anchored to a DOM element:');
        lines.push('');
        for (const c of orphanedComments) {
            lines.push(`- **${c.reviewer.name}** on \`${c.cssSelector}\`: "${c.text}"`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
