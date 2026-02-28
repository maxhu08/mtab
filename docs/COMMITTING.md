# Committing

## Commit Message

- Use Conventional Commits format:
  - `type(optional-scope): short summary`
- Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.
- Examples:
  - `feat(search): add custom engine toggle`
  - `fix(options): persist wallpaper setting`
  - `docs(contributing): shorten setup section`
- Include issue number when relevant:
  - `feat(search): add custom engine toggle (#11)`

## Pre-Commit Hook

- Husky formats staged files before commit with Prettier.

## Before Opening a PR

1. Ensure the feature works locally.
2. Run `bun run check`.
3. Push your branch and open a PR with a clear change summary.
