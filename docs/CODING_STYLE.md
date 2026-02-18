# Coding Style

Formatting is handled by Prettier on commit. Follow these project-specific rules:

## Core Rules

- Use 2-space indentation.
- Do not use trailing commas.
- Use `camelCase` for variables and object keys.
- Use `PascalCase` for interface names and types.

## Config Key Naming

- Use present tense: `search.useCustomEngine`, not `search.usingCustomEngine`.
- For nested keys, do not repeat the parent name.
- Prefer:
  - Wrong: `{ search: { useCustomSearchEngine: true } }`
  - Right: `{ search: { useCustomEngine: true } }`

Useful reference: `src/newtab/scripts/config.ts`.

## TypeScript Patterns

- Keep interface fields one per line and end each with `;`.
- End type declarations with `;`.

Example:

```ts
interface ButtonSwitch {
  buttons: HTMLButtonElement[];
  attr: string;
}
```
