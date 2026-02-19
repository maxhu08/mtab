# Contributing

Use this page as the fast entry point for contributors.

## Quick Start

1. Read [Setup](./SETUP.md) and run the project locally.
2. Follow [Coding Style](./CODING_STYLE.md) while you code.
3. If you touch options UI/config behavior, read [Options Page](./OPTIONS_PAGE.md).
4. Check [Project Structure](./PROJECT_STRUCTURE.md) if you are unsure where code belongs.
5. Use [Committing](./COMMITTING.md) before opening a PR.

## Useful Things

- Run development build: `bun d`
- Build release artifacts: `bun build-chrome` and `bun build-firefox`
- Package zip files: `bun package-chrome` and `bun package-firefox`
- Format code before committing: `bun prettier`
- Formatter is also enforced by pre-commit hooks.

## Scope Notes

- Paths ending in `/` are directories.
- Keep PRs focused: one change-set, one clear purpose.
