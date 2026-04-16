# todo_app

This repository builds and publishes a container image to GitHub Container Registry
(GHCR) so it can be installed with Once.

## Image

- Registry path: `ghcr.io/<owner>/todo_app`
- Published by GitHub Actions from `.github/workflows/publish-image.yml`
- Tags include branch/tag refs, commit SHA, and `latest` on the default branch

## Make the package public in GHCR

By default, GHCR packages created from Actions are private. After the first push,
set package visibility to public:

1. Open your repository on GitHub.
2. Go to **Packages** and select `todo_app`.
3. Open **Package settings**.
4. Under **Danger Zone**, change visibility to **Public**.

You can also do this with `gh`:

```sh
gh api \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  /user/packages/container/todo_app/visibility \
  -f visibility=public
```

If the package is owned by an organization, use the org endpoint instead:

```sh
gh api \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  /orgs/<org>/packages/container/todo_app/visibility \
  -f visibility=public
```

## Use in Once

Install with image reference:

```text
ghcr.io/<owner>/todo_app:latest
```
