import * as assert from 'assert';
import * as lib from '../src/yarn-convert';

describe('yarn-convert', () => {
  it('statics', () => {
    assert.ok(new lib.YarnConverter());
  });
});
