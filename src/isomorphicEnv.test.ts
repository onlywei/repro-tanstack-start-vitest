import { describe, expect, it } from 'vitest';
import { getIsomorphicEnv } from './isomorphicEnv';

describe('createIsomorphicFn', () => {
  it('returns a server or client value', () => {
    const env = getIsomorphicEnv();

    expect(env).toBe('client');
  });
});
