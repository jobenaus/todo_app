# AGENTS.md

## Scope and purpose
- This is a single Rails 8.1 app (`TodoApp`) intended to be run as a container image in Once.
- Keep changes focused on app behavior and Once/GHCR delivery; avoid adding unrelated infra patterns.

## Fast orientation
- App entrypoints: `config/routes.rb` (`root "todos#index"`, `resources :todos`, health check at `/up`).
- Main flow is server-rendered Rails in `app/controllers/todos_controller.rb` + `app/views/todos/index.html.erb`.
- Persistence is SQLite; production DB files are under `/storage` (see `config/database.yml`).

## Commands that matter
- Initial/local setup: `bin/setup --skip-server` (installs gems, prepares DB, clears tmp/log).
- Run app locally: `bin/dev` (this repo does not run extra JS/CSS dev processes).
- Full local CI sequence: `bin/ci` (source of truth order is in `config/ci.rb`).
- Rails tests: `bin/rails test`
- System tests: `bin/rails test:system`
- E2E Playwright tests: `npm run test:e2e` (default base URL is `http://codex.localhost`; can override with `PLAYWRIGHT_BASE_URL=...`).

## CI and verification expectations
- GitHub CI in `.github/workflows/ci.yml` runs: `brakeman`, `bundler-audit`, `importmap audit`, `rubocop`, unit tests, and system tests.
- CI test jobs install `libvips`; if tests fail in fresh Linux environments, check that package first.
- Preferred pre-PR check is `bin/ci`; run targeted commands only when iterating quickly.

## Container and Once/GHCR specifics
- Production image is built from `Dockerfile` and serves on port `80`; entrypoint runs `db:prepare` when launching Rails server.
- Publish workflow: `.github/workflows/publish-image.yml` pushes to `ghcr.io/<owner>/<repo>` with branch/tag/SHA tags and `latest` on default branch.
- If setting up a new fork/repo, confirm GHCR package visibility is public or Once pulls will fail for unauthenticated installs.

## Deployment config gotcha
- `config/deploy.yml` is still scaffold/default (registry `localhost:5555`, placeholder server IP). Update this before using Kamal deploy commands.

## Editing guardrails
- Do not commit secrets (`config/master.key`, `.env*`).
- Preserve `/up` health endpoint compatibility; Once relies on it.

## User preferences observed in this repo
- Prefer execution over discussion: when asked for infra/release tasks, proceed end-to-end (repo setup, push, workflow run, package checks) and report results.
- Primary outcome priority is Once compatibility via public GHCR images; treat `ghcr.io/...:latest` availability as a key success condition.
- Keep responses concise and action-oriented after completing the work.
- Always use Playwright (`npm run test:e2e`) for app verification in this environment.
- Default deployed host for verification is `codex.localhost`.
- After making changes, commit and push without waiting for a separate prompt.

## Deployment notes learned
- There may be multiple Once apps running (`codex.localhost` and `todo.localhost`) with different image names.
- `codex.localhost` currently tracks `ghcr.io/jobenaus/todo_app:latest` and should be the default update/test target.
- `todo.localhost` may still point to `ghcr.io/jobenaus/todo-app:latest` (hyphen), so verify target before running `once update`.

## Required delivery pipeline
- Unless explicitly told otherwise, execute work in this order: **build feature -> dockerize -> push to GHCR -> Once update -> Playwright test**.
- Treat the task as incomplete until all five stages are addressed or any blocker is clearly reported.
- For the GHCR stage, ensure the pushed image is usable as `ghcr.io/<owner>/todo_app:latest`.
