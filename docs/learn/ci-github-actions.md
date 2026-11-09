# CI with GitHub Actions

**What:** CI (continuous integration) is a robot that runs our checks on every pull request. GitHub Actions is GitHub's robot. It reads `.github/workflows/ci.yml` and runs the steps on a fresh Linux machine.

**Why:** "works on my laptop" is not enough. A clean machine proves that anyone can install and check the project. With branch protection on, a red check blocks the merge.

**Where:** `.github/workflows/ci.yml`, one job called `ci`. It runs on every pull request and on every push to `main`.

**The steps, in order:**

1. `checkout` the code (full history, so Nx can compare with `main`).
2. `setup-node` with the version from `.nvmrc`, plus the npm download cache.
3. `npm ci`: install exactly what `package-lock.json` says.
4. Restore the Nx cache (results of earlier runs).
5. `npx playwright install --with-deps chromium`: story tests run in a real browser, and a fresh machine has none. Nx caches test results but does not know the browser version, so this step must always run.
6. `prettier --check .`
7. `nx affected -t lint typecheck test`: only the projects changed compared with `main` (on a push to `main`: compared with the previous commit).
8. `nx run @daily-chunk/app:export:web`: proves the web build works.

**Required check:** the job name `ci` is what branch protection waits for. The command that turns this on is in `docs/progress.md` (step 0.6); the owner applies it after the first green run, because GitHub only offers a check name once it has run.

**Run the same steps locally:** `npm ci`, `npx prettier --check .`, `npx nx run-many -t lint typecheck test`, `npx nx run @daily-chunk/app:export:web`.
