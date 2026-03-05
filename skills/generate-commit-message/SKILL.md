---
name: generate-commit-message
description: Generate commit messages that follow this repository's commit policy. Use when the user asks for a commit message, wants Conventional Commits formatting, or needs a commit subject validated against docs/COMMITTING.md and commitlint rules.
---

# Generate Commit Message

Read `docs/COMMITTING.md` before drafting the message.

## Workflow

1. Identify the change intent from the user request, staged diff, or provided summary.
2. Choose a Conventional Commit `type` that matches the change:
- `feat` for new behavior
- `fix` for bug fixes
- `docs` for documentation-only changes
- `refactor` for internal code restructuring without behavior change
- `test` for tests
- `chore` for maintenance/tooling work
3. Choose an optional scope when it improves clarity (for example: `core`, `options`, `docs`, `watch-mode`).
4. Write a short summary in lowercase, imperative style, without a trailing period.
5. Include issue reference only when relevant, in the form `(#123)` at the end.
6. Return one primary commit subject line using:
`type(optional-scope): short summary`

## Output Rules

- Keep the subject concise and specific.
- Prefer one best message unless the user asks for alternatives.
- If confidence is low, provide up to 3 options and clearly label the recommended one first.
- Do not invent issue numbers.

## Validation

When asked to validate, check the message against `commitlint.config.cjs` and the rule examples in `docs/COMMITTING.md`.
Use this command format:
`printf '<message>\n' | bun run commitlint`
