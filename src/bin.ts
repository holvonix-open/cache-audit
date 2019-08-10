#!/usr/bin/env node
import * as fs from 'fs';
import * as util from 'util';
import * as os from 'os';
import * as path from 'path';
import * as child_process from 'child_process';

import { toPackage, rep, toDepsSets } from './package';
import { YarnConverter } from './yarn-convert';
import { dump } from './output';

/* istanbul ignore file */

async function go() {
  const str = await util.promisify(fs.readFile)(0, 'utf-8');
  const y = new YarnConverter();
  const cl = y.toCacheList(str);
  const md = y.toMultiDeps(cl);
  const dss = toDepsSets(md);
  const pkgs = dss.map((d, i) => toPackage(d, i));
  const td = await util.promisify(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);
  const ps = pkgs.map(async m => {
    const myd = `${td}${path.sep}pkg-${m.name}`;
    await util.promisify(fs.mkdir)(myd);
    const fname = path.join(myd, 'package.json');
    await util.promisify(fs.writeFile)(fname, JSON.stringify(m, rep));
    return fname;
  });
  const names = await Promise.all(ps);
  for (const n of names) {
    const npmi = child_process.spawnSync(
      'npm',
      ['i', '--package-lock-only', '--no-audit'],
      { cwd: path.dirname(n), encoding: 'utf-8' }
    );
    dump(npmi, n + ' > npm i --package-lock-only --no-audit');
    if (!npmi.error && npmi.status === 0) {
      const npmaudit = child_process.spawnSync(
        'npm',
        ['audit', '--parseable'],
        { cwd: path.dirname(n), encoding: 'utf-8' }
      );
      dump(npmaudit, n + ' > npm audit --parseable');
    }
  }
}

go();
