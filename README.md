# TanStack Start + Vitest Bug Reproduction

This repository demonstrates a bug that occurs when using TanStack Start with Vitest in a pnpm workspace.

## The Problem

When running Vitest tests in a TanStack Start application within a pnpm workspace, tests fail with the error:

```
Cannot read properties of null (reading 'useState')
```

This happens because the TanStack Start Vite plugin applies `optimizeDeps` configuration even in the Vitest environment, which interferes with how React is resolved during test execution.

**Note:** This bug occurs regardless of whether hoisting is enabled or disabled in pnpm. It affects all pnpm workspace configurations.

## The Fix

This issue is fixed by [PR #6074](https://github.com/TanStack/router/pull/6074) by conditionally applying the TanStack Start plugin only when NOT in a Vitest environment.

**Before (causes error):**
```typescript
plugins: [
  tanstackStart(),
  viteReact()
]
```

**After (fixes error):**
```typescript
plugins: [
  process.env.VITEST !== 'true' && tanstackStart(),
  viteReact()
]
```

## Repository Structure

```
.
├── pnpm-workspace.yaml        # Workspace configuration
├── package.json
├── apps/
│   └── start-app/             # TanStack Start app
│       ├── src/
│       │   ├── App.tsx        # Imports Button from ui-button
│       │   └── App.test.tsx   # Test that triggers the bug
│       └── vite.config.ts     # Without the fix
└── packages/
    └── ui-button/             # Simple UI package
        └── src/
            └── Button.tsx     # Uses useState hook
```

## Prerequisites

- Node.js 18 or newer
- pnpm (this repo uses pnpm@10.26.2)

## Reproduction Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the tests (this will fail):**
   ```bash
   cd apps/start-app
   pnpm test
   ```
   
   Or run from the root:
   ```bash
   pnpm test
   ```

3. **Expected error:**
   You should see errors like:
   ```
   Cannot read properties of null (reading 'useState')
   ```

## How to Apply the Fix

Edit `apps/start-app/vite.config.ts` and change:

```typescript
plugins: [
  tanstackStart(),
  viteReact(),
]
```

To:

```typescript
plugins: [
  process.env.VITEST !== 'true' && tanstackStart(),
  viteReact(),
]
```

Then run the tests again:
```bash
pnpm test
```

The tests should now pass! ✅

## Why Does This Happen?

The bug is triggered by this specific combination:

1. **pnpm workspace** - Standard pnpm workspace setup (hoisting enabled or disabled)
2. **TanStack Start plugin applied unconditionally** - Runs `optimizeDeps` in the test environment
3. **Component from workspace package with React peerDependency** - The package requires React to be provided by the consuming app
4. **Vitest test that renders the component** - Where the React resolution fails

When the TanStack Start plugin runs during Vitest execution, its `optimizeDeps` configuration interferes with module resolution. React is resolved incorrectly (as `null`) when importing components from workspace packages, causing the "Cannot read properties of null (reading 'useState')" error.

This occurs regardless of pnpm's hoisting configuration, making it a critical issue that affects all pnpm workspace setups with TanStack Start.

## Related Links

- [PR #6074: fix(react-start): Do not optimizeDeps in VITEST environment](https://github.com/TanStack/router/pull/6074)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vitest Documentation](https://vitest.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
