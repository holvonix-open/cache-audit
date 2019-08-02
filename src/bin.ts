#!/usr/bin/env node
import * as fs from 'fs';
import * as util from 'util';

import { MultiDeps, toPackage, rep } from './package';
import { YarnConverter } from './yarn-convert';

/* istanbul ignore file */

async function go() {
  const str = await util.promisify(fs.readFile)(0, 'utf-8');
  const y = new YarnConverter();
  const cl = y.toCacheList(str);
  const md = y.toMultiDeps(cl);
  const pkg = toPackage(md);
  process.stdout.write(JSON.stringify(pkg, rep) + '\n');
}

go();
