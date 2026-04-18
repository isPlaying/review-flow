# Commit Message Guide

This project follows the Conventional Commits standard, which is widely used across international engineering teams.

## Why

- Better readability in pull requests and git history
- Easier release automation and changelog generation
- Clear signal for feature, fix, and breaking changes

## Format

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Examples:

```text
feat(auth): add login form validation
fix(documents): handle empty list state
docs(readme): update setup instructions
refactor(comments): split API and hooks modules
```

## Type

- `feat`: a new feature
- `fix`: a bug fix
- `docs`: documentation only changes
- `style`: formatting/style-only changes (no logic change)
- `refactor`: code change that is neither feature nor fix
- `perf`: performance improvement
- `test`: adding or updating tests
- `build`: build system or external dependency changes
- `ci`: CI/CD configuration changes
- `chore`: other maintenance tasks
- `revert`: revert a previous commit

## Scope

Scope is optional but recommended.

For this repository, suggested scopes are:

- `auth`
- `documents`
- `pdf`
- `comments`
- `review`
- `ui`
- `api`
- `query`
- `form`
- `store`
- `build`
- `deps`
- `docs`

## Subject Rules

- Use imperative mood: `add`, `fix`, `remove`, `update`
- Keep it concise, usually within 50 characters
- Do not end with a period
- Prefer lowercase at the start

Good:

```text
fix(pdf): prevent viewer crash on invalid url
```

Avoid:

```text
Fixed PDF issue.
```

## Body (Optional)

Use body when context is needed:

- what changed
- why it changed
- any tradeoff

Example:

```text
fix(comments): avoid duplicate optimistic items

Deduplicate temporary ids before merging server response.
This prevents repeated comments during slow network retries.
```

## Footer (Optional)

Use footers for metadata:

- `Closes #123`
- `Refs #456`
- `Co-authored-by: Name <email@example.com>`

## Breaking Changes

Use one of these patterns:

```text
feat(api)!: rename review status enum values
```

or

```text
feat(api): rename review status enum values

BREAKING CHANGE: status values changed from DRAFT/READY to NEW/APPROVED.
```

## Quick Templates

```text
feat(scope): add ...
fix(scope): fix ...
refactor(scope): simplify ...
docs(scope): update ...
chore(scope): clean up ...
```

## Project Examples

```text
feat(auth): add login page with react hook form
fix(documents): show empty state when no records
feat(pdf): add preview panel with loading fallback
feat(comments): support create and list comments
refactor(query): centralize query keys by feature
chore(deps): upgrade antd and react-query
docs(agents): add commit message command notes
```

## Team Recommendation

- Keep one logical change per commit
- Use `feat` and `fix` accurately for release notes
- Prefer scope for easier filtering
- Avoid vague messages like `update code` or `fix bug`
