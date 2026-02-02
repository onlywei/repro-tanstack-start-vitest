# How to Verify the Fix

This document shows how to apply the fix and verify it works.

## Current State (Bug Reproduction)

The repository is currently configured to reproduce the bug. Running tests will fail:

```bash
pnpm test
```

**Expected Error:**
```
TypeError: Cannot read properties of null (reading 'useState')
    at useState (...)
    at Button (/Users/.../src/components/Button.tsx:9:29)
```

## Applying the Fix

Edit `vite.config.ts`:

### Before (Current - Shows Bug):
```typescript
export default defineConfig({
  plugins: [
    tanstackStart(),  // ❌ This runs in Vitest environment
    viteReact(),
  ],
  // ...
});
```

### After (With Fix):
```typescript
export default defineConfig({
  plugins: [
    process.env.VITEST !== 'true' && tanstackStart(),  // ✅ Skip in Vitest
    viteReact(),
  ],
  // ...
});
```

## Verifying the Fix

After making the change above, run the tests again:

```bash
pnpm test
```

**Expected Result:**
```
✓ src/App.test.tsx (2)
  ✓ App (2)
    ✓ renders the app component
    ✓ renders the button component

Test Files  1 passed (1)
     Tests  2 passed (2)
```

All tests should pass! ✅

## Why This Works

The conditional `process.env.VITEST !== 'true'` prevents the TanStack Start plugin from running during test execution. When the plugin doesn't run in Vitest:

1. It doesn't apply `optimizeDeps` configuration
2. React is resolved correctly during tests
3. Components that use React hooks render normally
4. Tests pass as expected

The plugin is still applied during normal development (`pnpm dev`) and production builds (`pnpm build`), so application functionality is unaffected.

## Important Note

This bug occurs in **single-package setups as well**, not just pnpm workspaces. The issue is specifically with how TanStack Start's `optimizeDeps` configuration interacts with Vitest's module resolution when React is resolved during tests.
