export type MultiDeps = Map<string, string[]>;

export type Deps = Map<string, string>;

// tslint:disable-next-line:no-any
export function rep(k: any, v: any) {
  if (v instanceof Map) {
    // tslint:disable-next-line:no-any
    const ret: { [key: string]: any } = {};
    for (const [kk, vv] of v) {
      ret[kk] = vv;
    }
    return ret;
  }
  return v;
}

export function toDepsSets(md: MultiDeps): Deps[] {
  const depsSets: Deps[] = [];
  const weirdSets: Deps[] = [];
  for (const [k, vv] of md) {
    let normal = 0;
    for (const v of vv) {
      if (!v.match(/^\d/)) {
        weirdSets.push(new Map<string, string>([[k, v]]));
      } else {
        if (depsSets[normal]) {
          if (depsSets[normal].has(k)) {
            throw new RangeError('repeat key ' + k);
          }
          depsSets[normal].set(k, v);
        } else {
          depsSets.push(new Map<string, string>([[k, v]]));
        }
        normal++;
      }
    }
  }
  return depsSets.concat(weirdSets).reverse();
}

export function toPackage(md: Deps, i: number) {
  const pkg = {
    name: '_audit-cache-list-' + i,
    version: '0.0.1',
    private: true,
    dependencies: {} as { [key: string]: string },
    devDependencies: {},
    description: 'nothing',
    license: 'UNLICENSED',
    readme: './package.json',
  };
  for (const [k, v] of md) {
    pkg.dependencies[k] = v;
  }
  return pkg;
}
