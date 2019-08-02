import { Deps, MultiDeps } from './package';

export interface YarnCacheList {
  type: 'table';
  data: {
    head: ['Name', 'Version', 'Registry', 'Resolved'];
    body: Array<[string, string, string, string]>;
  };
}

/**
 * Converts the JSON output of `yarn cache list --no-progress --json` to a package.json
 * file.
 */
export class YarnConverter {
  constructor() {}

  private mapItem(
    name: string,
    version: string,
    registry: string,
    resolved: string
  ) {
    if (registry !== 'npm') {
      throw new Error(registry);
    }
    if (!resolved.match(/^https?:\/\/registry\.(yarnpkg\.com|npmjs\.org)/)) {
      // For example, github.com commit references.
      return resolved;
    }
    return version;
  }

  toCacheList(s: string): YarnCacheList {
    return JSON.parse(s) as YarnCacheList;
  }

  toMultiDeps(c: YarnCacheList): MultiDeps {
    const map = new Map<string, string[]>();
    for (const e of c.data.body) {
      const [name, version, registry, resolved] = e;
      if (map.has(name)) {
        map.get(name)!.push(this.mapItem(name, version, registry, resolved));
      } else {
        map.set(name, [this.mapItem(name, version, registry, resolved)]);
      }
    }
    return map;
  }
}
