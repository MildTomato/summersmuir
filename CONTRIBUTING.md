# Contributing

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. This allows `standard-version` to automatically determine version bumps and generate changelogs.

**Important:** We use **squash and merge** for PRs, so your **PR title** becomes the commit message. Make sure PR titles follow the conventional commit format below.

### Commit Types

- `feat:` A new feature (bumps MINOR version)
- `fix:` A bug fix (bumps PATCH version)
- `perf:` A performance improvement (bumps PATCH version)
- `refactor:` Code refactoring (bumps PATCH version)
- `docs:` Documentation changes (no version bump)
- `style:` Code style changes (no version bump)
- `chore:` Build process or auxiliary tool changes (no version bump)
- `ci:` CI configuration changes (no version bump)
- `build:` Build system changes (no version bump)
- `test:` Adding or updating tests (no version bump)

### Breaking Changes

To indicate a breaking change, add `BREAKING CHANGE:` to the PR description. This will bump the MAJOR version.

Example PR title:
```
feat: add new API endpoint
```

With PR description:
```
BREAKING CHANGE: The old endpoint has been removed
```

### PR Title Examples

```
feat: add blog post search functionality
fix: resolve MDX rendering issue with code blocks
perf: optimize blog post loading
docs: update README with setup instructions
```

## Release Process

1. Work on feature branches
2. Create PR with conventional commit format title
3. Squash and merge PR to `main`
4. When ready to release, run:
   ```bash
   npm run release        # Defaults to patch
   # or
   npm run release:patch  # Bug fixes
   npm run release:minor  # New features
   npm run release:major  # Breaking changes
   ```
5. Review the generated CHANGELOG.md
6. Push the release: `git push --follow-tags origin main`
7. Create a GitHub release from the tag

