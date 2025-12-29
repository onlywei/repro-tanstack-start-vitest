# How to Verify the Fix

This document shows how to apply the fix and verify it works.

## Current State (Bug Reproduction)

The repository is currently configured to reproduce the bug. Running tests will fail:

```bash
cd apps/start-app
pnpm test
```

Or from the workspace root:
```bash
pnpm test
```

**Expected Error:**
```
TypeError: Cannot read properties of null (reading 'useState')
    at useState (...)
    at Button (/Users/.../packages/ui-button/src/Button.tsx:9:29)
```

## Applying the Fix

Edit `apps/start-app/vite.config.ts`:

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
    ✓ renders the button from workspace package

Test Files  1 passed (1)
     Tests  2 passed (2)
```

All tests should pass! ✅

## Why This Works

The conditional `process.env.VITEST !== 'true'` prevents the TanStack Start plugin from running during test execution. When the plugin doesn't run in Vitest:

1. It doesn't apply `optimizeDeps` configuration
2. React is resolved correctly from the app's dependencies
3. Components from workspace packages can use React hooks normally
4. Tests pass as expected

The plugin is still applied during normal development (`pnpm dev`) and production builds (`pnpm build`), so application functionality is unaffected.

## Important Note

This bug occurs in **all pnpm workspace configurations**, regardless of whether hoisting is enabled or disabled. The issue is specifically with how TanStack Start's `optimizeDeps` configuration interacts with Vitest's module resolution when importing components from workspace packages that have React as a peer dependency.

