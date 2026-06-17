# AGENTS.md

## Coding Approach

### Think Before Coding

Do not assume, hide confusion, or skip tradeoffs.

Before implementing:

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them instead of choosing silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what is confusing, and ask.

### Simplicity First

Write the minimum code that solves the problem. Avoid speculative work.

- Do not add features beyond what was asked.
- Do not add abstractions for single-use code.
- Do not add flexibility or configurability that was not requested.
- Do not add error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Do not improve adjacent code, comments, or formatting unless needed for the task.
- Do not refactor things that are not broken.
- Match existing style, even if you would do it differently.
- If you notice unrelated dead code, mention it instead of deleting it.

When your changes create orphans:

- Remove imports, variables, and functions that your changes made unused.
- Do not remove pre-existing dead code unless asked.

Every changed line should trace directly to the user's request.

### Goal-Driven Execution

Define success criteria and loop until verified.

Transform tasks into verifiable goals:

- "Add validation" means write tests for invalid inputs, then make them pass.
- "Fix the bug" means write a test that reproduces it, then make it pass.
- "Refactor X" means ensure tests pass before and after.

For multi-step tasks, state a brief plan:

1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]

## Style Guide

This repo prefers small, direct Bun and TypeScript code. Keep changes minimal and aligned with the patterns already used here.

### General Principles

- Keep logic in one function unless extracting it clearly improves reuse or composition
- Avoid `try`/`catch` unless there is a real recovery path
- Avoid `any`
- Prefer single-word variable names when they still read clearly
- Use Bun APIs when practical. Prefer `Bun.file()` for straightforward file reads, and use `node:fs` for broader filesystem work like copying, writing, removing, or traversing directories
- Rely on type inference; add explicit annotations or interfaces only when exports or readability need them
- Prefer functional array methods like `flatMap`, `filter`, and `map` over loops; when filtering, use type guards so downstream inference stays precise

Inline values that are only used once to keep variable count low.

```ts
// Good
const version = (await Bun.file(resolve(ROOT, "EXTENSION_VERSION.txt")).text()).trim();

// Bad
const versionFile = resolve(ROOT, "EXTENSION_VERSION.txt");
const version = (await Bun.file(versionFile).text()).trim();
```

### Destructuring

Avoid object destructuring unless it clearly improves readability. Prefer dot notation so object context stays visible.

This applies to local assignments, function parameters, callback parameters, and values returned from helpers. Default to `obj.x` over pulling properties into standalone names.

```ts
// Good
obj.a;
obj.b;

function render(user) {
  return user.name;
}

items.map((item) => item.id);

// Bad
const { a, b } = obj;

function render({ name }) {
  return name;
}

items.map(({ id }) => id);
```

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassigning values.

```ts
// Good
const foo = condition ? 1 : 2;

// Bad
let foo;
if (condition) foo = 1;
else foo = 2;
```

### Control Flow

Prefer early returns when one branch exits immediately. Keep direct `if`/`else` blocks when they express one paired decision more clearly than split `if` statements.

```ts
// Good
function foo() {
  if (condition) return 1;
  return 2;
}

function bar(condition) {
  if (condition) {
    doThing();
  } else {
    doOtherThing();
  }
}

// Bad
function foo() {
  if (condition) return 1;
  else return 2;
}

function bar(condition) {
  if (condition) {
    doThing();
  }
  if (!condition) {
    doOtherThing();
  }
}
```

## Testing

- Avoid mocks when possible
- Test the real implementation instead of duplicating production logic in tests

## Type Checking

- Always run `bun typecheck`; do not run `tsc` directly

## Check

Run `bun check` after every change.
