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

export function toPackage(md: MultiDeps) {
  const pkg = {
    name: '_audit-cache-list',
    version: '0.0.1',
    private: true,
    dependencies: {} as { [key: string]: string },
    devDependencies: {},
    description: 'nothing',
    license: 'UNLICENSED',
    readme: './package.json',
  };
  for (const [k, vv] of md) {
    pkg.dependencies[k] = vv.join(' || ');
  }
  return pkg;
}
