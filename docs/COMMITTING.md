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
- Commit messages are enforced by a Husky `commit-msg` hook through `commitlint`.
- Config lives in `commitlint.config.cjs`.
- Manual check example: `printf 'fix(core): adjust focus behavior\n' | bun run commitlint`

## Reference Docs

- Commitlint local setup: `https://commitlint.js.org/guides/local-setup.html`
- Conventional config: `https://commitlint.js.org/reference/configuration.html`
- Husky hooks: `https://typicode.github.io/husky/`

## Pre-Commit Hook

- Husky formats staged files before commit with Prettier.
- Husky also validates the commit message before the commit is created.

## Before Opening a PR

1. Ensure the feature works locally.
2. Run `bun run check`.
3. Push your branch and open a PR with a clear change summary.
