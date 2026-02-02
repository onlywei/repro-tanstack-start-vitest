import { createIsomorphicFn } from '@tanstack/react-start';

export const getIsomorphicEnv = createIsomorphicFn()
  .server(() => 'server')
  .client(() => 'client');
