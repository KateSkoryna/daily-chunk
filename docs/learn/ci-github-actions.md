# CI with GitHub Actions

**What:** CI (continuous integration) is a robot that runs our checks on every pull request. GitHub Actions is GitHub's robot. It reads `.github/workflows/ci.yml` and runs the steps on a fresh Linux machine.

**Why:** "works on my laptop" is not enough. A clean machine proves that anyone can install and check the project. With branch protection on, a red check blocks the merge.

**Where:** `.github/workflows/ci.yml` (four jobs) and `.github/actions/setup/action.yml` (shared setup). It runs on every pull request and on every push to `main`.

**Four jobs, in parallel.** Each job gets its own fresh Linux machine and starts at the same time, so the PR shows exactly which one failed:

| Job              | Runs                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `format`         | `prettier --check .`                                              |
| `lint-typecheck` | `nx affected -t lint typecheck`                                   |
| `test`           | Playwright Chromium install, then `nx affected -t test`           |
| `build`          | `nx run @daily-chunk/app:export:web` (proves the web build works) |

**Shared setup** (the `setup` action, used by every job after `checkout`): Node from `.nvmrc` with the npm cache, `npm ci` (exactly what `package-lock.json` says), and the Nx cache. Jobs share no files, so each one repeats this.

**Affected:** only projects changed compared with `main` (on a push to `main`: compared with the commit before the push). The `test` job always installs Chromium: Nx caches test results but does not know the browser version.

**Required checks:** branch protection waits for the four job names. The command is in `docs/progress.md` (step 0.6); the owner applies it after the first green run, because GitHub only offers a check name once it has run.

**Run the same steps locally:** `npm ci`, `npx prettier --check .`, `npx nx run-many -t lint typecheck test`, `npx nx run @daily-chunk/app:export:web`.
