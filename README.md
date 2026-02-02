# TanStack Start + Vitest Bug Reproduction

This repository demonstrates a bug that occurs when using TanStack Start with Vitest, even in a single-package project.

## The Problem

When running Vitest tests in a TanStack Start application, tests fail with the error:

```
Cannot read properties of null (reading 'useState')
```

This happens because the TanStack Start Vite plugin applies `optimizeDeps` configuration in the Vitest environment, which interferes with how React is resolved during test execution.

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
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── App.tsx
    ├── App.test.tsx
    ├── components/
    │   └── Button.tsx
    ├── routes/
    │   └── __root.tsx
    ├── routeTree.gen.ts
    └── router.tsx
```

## Prerequisites

- Node.js 18 or newer
- pnpm (this repo uses pnpm@10.28.2)

## Reproduction Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the tests (this will fail):**
   ```bash
   pnpm test
   ```

3. **Expected error:**
   You should see errors like:
   ```
   Cannot read properties of null (reading 'useState')
   ```

## How to Apply the Fix

Edit `vite.config.ts` and change:

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

1. **TanStack Start plugin applied unconditionally** - Runs `optimizeDeps` in the test environment
2. **Vitest test that renders a component using hooks** - React resolves incorrectly (as `null`)
3. **React hook usage** - Causes the "Cannot read properties of null (reading 'useState')" error

When the TanStack Start plugin runs during Vitest execution, its `optimizeDeps` configuration interferes with module resolution. React is resolved incorrectly (as `null`) when rendering components that use hooks, causing the failure.

## Related Links

- [PR #6074: fix(react-start): Do not optimizeDeps in VITEST environment](https://github.com/TanStack/router/pull/6074)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vitest Documentation](https://vitest.dev/)
