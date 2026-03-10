// Resolve target path based on installation scope

import { homedir } from 'node:os';
import { join } from 'node:path';

export function resolveTarget(scope) {
  switch (scope) {
    case 'global':
      return join(homedir(), '.claude');
    case 'project':
      return join(process.cwd(), '.claude');
    case 'local':
      return join(process.cwd(), '.claude', 'local');
    default:
      throw new Error(`Invalid scope: ${scope}. Use: global, project, or local`);
  }
}

export function parseScope(args) {
  const idx = args.indexOf('--scope');
  if (idx === -1 || idx + 1 >= args.length) return 'project';
  return args[idx + 1];
}
