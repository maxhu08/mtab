# Contributing

Use this page as the fast entry point for contributors.

## Quick Start

1. Read [Setup](./SETUP.md) and run the project locally.
2. Follow [Coding Style](./CODING_STYLE.md) while you code.
3. If you touch options UI/config behavior, read [Options Page](./OPTIONS_PAGE.md).
4. Check [Project Structure](./PROJECT_STRUCTURE.md) if you are unsure where code belongs.
5. Use [Committing](./COMMITTING.md) before opening a PR.

## Useful Things

- Run development build: `bun run dev` or `bun run dev:firefox`
- Build release artifacts: `bun run build:chrome` and `bun run build:firefox`
- Package zip files: `bun run package:chrome` and `bun run package:firefox`
- Build release candidate artifacts: `bun run rc:chrome` and `bun run rc:firefox`
- Package the source tree: `bun run package:source`
- Validate changes before committing: `bun run check`
- Format code before committing: `bun run format`
- Formatter is also enforced by pre-commit hooks.

## Scope Notes

- Paths ending in `/` are directories.
- Keep PRs focused: one change-set, one clear purpose.
