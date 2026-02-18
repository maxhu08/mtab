# Committing

## Commit Message

- Keep messages short and specific.
- Include issue number when relevant.
- Example: `fix search toggle state (#11)`

## Pre-Commit Hook

- Husky runs formatting checks before commit (`bun prettier`).
- If commit fails, format your changes and retry.

## Before Opening a PR

1. Ensure the feature works locally.
2. Ensure formatting passes.
3. Push your branch and open a PR with a clear change summary.
