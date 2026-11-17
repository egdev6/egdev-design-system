import assert from 'node:assert/strict';

export function readClientConfig(markdown) {
  const blocks = ['pi', 'claude-desktop'].map((id) => {
    const pattern = new RegExp(
      `<!-- mcp-config:${id} -->\\n\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- /mcp-config:${id} -->`,
      'g'
    );
    const matches = [...markdown.matchAll(pattern)];
    assert.equal(matches.length, 1, `${id}: exactly one marked configuration`);
    return JSON.parse(matches[0][1]);
  });
  assert.deepEqual(blocks[0], blocks[1]);
  return blocks[0].mcpServers.egdev;
}
