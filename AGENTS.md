# AGENTS.md

## Think Before Coding

Do not assume, hide confusion, or skip tradeoffs.

- Investigate relevant code and context before asking questions. Do not ask the user for information you can discover yourself.
- Make assumptions and tradeoffs explicit. When requirements have materially different interpretations, ask rather than silently choosing.
- Challenge unnecessary complexity and conflicting requirements. Recommend simpler alternatives when appropriate.
- If new evidence invalidates the approach, reassess. Ask when scope or intended behavior changes; resolve ordinary implementation details independently.

## Plan Mode

- Clarify before proposing a solution. Ask focused questions about requirements, constraints, tradeoffs, and relevant edge cases.
- Continue with follow-up questions until no unresolved decisions block implementation. Do not invent answers that materially affect behavior.
- Avoid hypothetical cases or questions that would not change the approach. Explicitly agree on assumptions when uncertainty cannot be resolved.
- After clarification, summarize the agreed behavior, approach, scope boundaries, and verification steps.

## Simplicity First

- Write the smallest clear solution that meets the requirements. Do not add speculative features, configuration, or flexibility.
- Add guards and error handling for realistic failures or untrusted boundaries, not impossible states already ruled out by types, validation, or enforced invariants. Avoid redundant checks and unreachable fallbacks.
- Prefer existing project utilities and standard tools. Add dependencies only when their benefits justify the maintenance cost; do not reinvent substantial, well-solved functionality merely to avoid one.
- If 200 lines could be 50, rewrite it.
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Surgical Changes

Touch only what you must. Clean up only your own mess.

- Match surrounding conventions; do not reformat, refactor, or clean up unrelated code.
- Preserve unfamiliar changes. Remove imports, variables, and helpers made unused by your changes; mention unrelated dead code rather than deleting it.

Every changed line should trace directly to the user's request.

## Reuse and Encapsulate

- Look for existing solutions before writing new logic. Share genuinely repeated behavior instead of maintaining near-duplicate implementations.
- Do not combine code merely because it looks similar. Avoid speculative frameworks or helpers with flags and special cases for unrelated uses.
- Keep logic local unless extraction improves clarity, reuse, testing, composition, or correctness, or hides meaningful complexity.
- Hide complex implementations behind small, clear interfaces. Expose only what callers need and keep internals private.
- Own validation, invariants, and state transitions at the appropriate boundary. Make correct usage easy and invalid states or operation sequences difficult to express.
- Fix root causes where they belong rather than adding workarounds at every call site. Never conceal failures by weakening validation or swallowing errors.

## Code Style

This repo prefers small, direct Bun and TypeScript code. Keep changes minimal and aligned with the patterns already used here.

- Prefer correctness, readability, and consistency over mechanically applying rules.
- Avoid `try`/`catch` unless there is a real recovery path
- Avoid `any`
- Prefer single-word variable names when they still read clearly
- Use Bun APIs when practical. Prefer `Bun.file()` for straightforward file reads, and use `node:fs` for broader filesystem work like copying, writing, removing, or traversing directories
- Rely on type inference; add explicit annotations or interfaces only when exports or readability need them
- Prefer functional array methods like `flatMap`, `filter`, and `map` over loops; when filtering, use type guards so downstream inference stays precise
- Comment on why, not what.

Inline values that are only used once to keep variable count low.

```ts
// Good
const version = (await Bun.file(resolve(ROOT, "EXTENSION_VERSION.txt")).text()).trim();

// Bad
const versionFile = resolve(ROOT, "EXTENSION_VERSION.txt");
const version = (await Bun.file(versionFile).text()).trim();
```

## Destructuring

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

## Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassigning values.

```ts
// Good
const foo = condition ? 1 : 2;

// Bad
let foo;
if (condition) foo = 1;
else foo = 2;
```

## Control Flow

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

## Test What Matters

- Test meaningful behavior and contracts, not duplicated implementation logic. Each new test should catch a plausible failure that matters.
- Add regression coverage when it provides meaningful protection. Reuse existing coverage rather than adding redundant tests.
- Do not test incidental presentation details, such as a changed button color or CSS class, merely because they changed. Test them when they enforce a real requirement, such as accessibility or meaningful state.
- Use visual inspection when more appropriate for cosmetic changes.
- Prefer real dependencies when cheap, deterministic, and safe. Use mocks or fakes for slow, costly, nondeterministic, destructive, or external dependencies.
- Do not change tests merely to make failures disappear.

## Goal-Driven Execution

- Turn the request into observable success criteria before implementing.
- For multi-step work, give a brief plan pairing each step with its verification.
- Reproduce bugs before fixing them; verify invalid inputs for validation changes and preserve behavior during refactors.
- Work toward those criteria and verify the result. If a check fails, investigate and correct the cause rather than declaring completion.
- Review the final diff for unintended changes and run relevant checks.
- Report what changed, what was actually verified, and any remaining risks or verification gaps. Never claim checks passed unless they ran successfully.

## Type Checking

- Always run `bun typecheck`; do not run `tsc` directly

## Check

Run `bun check` after every change.

## Build

Always rebuild after making changes.
