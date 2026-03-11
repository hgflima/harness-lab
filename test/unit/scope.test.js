import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { resolveTarget, parseScope } from '../../src/core/scope.js';

describe('resolveTarget', () => {
  it('global → ~/.claude', () => {
    assert.equal(resolveTarget('global'), join(homedir(), '.claude'));
  });

  it('project → <cwd>/.claude', () => {
    assert.equal(resolveTarget('project'), join(process.cwd(), '.claude'));
  });

  it('local → <cwd>/.claude/local', () => {
    assert.equal(resolveTarget('local'), join(process.cwd(), '.claude', 'local'));
  });

  it('invalid scope throws', () => {
    assert.throws(
      () => resolveTarget('invalid'),
      { message: /global, project, or local/ }
    );
  });
});

describe('parseScope', () => {
  it('--scope global → global', () => {
    assert.equal(parseScope(['--scope', 'global']), 'global');
  });

  it('no args → project (default)', () => {
    assert.equal(parseScope([]), 'project');
  });

  it('--scope with missing value → project (default)', () => {
    assert.equal(parseScope(['--scope']), 'project');
  });

  it('--scope local → local', () => {
    assert.equal(parseScope(['--scope', 'local']), 'local');
  });

  it('--scope among other args', () => {
    assert.equal(parseScope(['foo', '--scope', 'global', '--other']), 'global');
  });
});
