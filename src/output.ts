import * as child_process from 'child_process';

export function dump(p: child_process.SpawnSyncReturns<string>, n: string) {
  process.stdout.write(`\n=============================\n\nOUT ${n}\n`);
  process.stdout.write(p.stdout + '\n');
  if (p.stderr && p.stderr.length > 0) {
    process.stdout.write(`\n=============================\n\nERR ${n}\n`);
    process.stdout.write(p.stderr + '\n');
  }

  if (p.error) {
    throw p.error;
  }
}
