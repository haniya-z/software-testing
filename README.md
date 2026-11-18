# Quality Gate Demo

A full-stack sample project (Express API + React frontend) protected by an automated
CI/CD quality gate built with GitHub Actions.

## Layout

```
backend/    Express API, Jest + Supertest tests, ESLint, Dockerfile
frontend/   React (Vite) UI, Vitest tests, Playwright e2e, Lighthouse config, Dockerfile + nginx
docker-compose.yml
.github/workflows/ci.yml   quality gate (pull requests and pushes to main)
.github/workflows/cd.yml   build, push images, deploy (after merge to main)
```

## Run locally

With Docker (closest to CI):

```bash
docker compose up --build
# open http://localhost:8080
```

Without Docker, in two terminals:

```bash
cd backend  && npm install && npm start        # http://localhost:3000
cd frontend && npm install && npm run dev      # http://localhost:5173 (proxies /api to :3000)
```

## Run the checks locally

```bash
cd backend  && npm run lint && npm test
cd frontend && npm run lint && npm test && npm run build
# e2e (needs the stack running via docker compose up -d --build --wait)
cd frontend && npx playwright install chromium && npm run e2e
```

## What the gate checks

| Job | Checks |
| --- | --- |
| backend-checks | ESLint, Jest with coverage thresholds, npm audit |
| frontend-checks | ESLint, Vitest with coverage thresholds, production build, npm audit |
| secret-scan | Gitleaks over full git history |
| codeql | Static security analysis |
| docker-scan | Trivy scan of both images (CRITICAL/HIGH fail the build) |
| e2e | Playwright smoke tests against the full docker compose stack |
| lighthouse | Performance >= 0.8, accessibility >= 0.9 |
| **quality-gate** | Fails if any job above failed, was cancelled, or was skipped |

## Turn the gate into an actual blocker

Workflows alone do not stop merges. In GitHub: **Settings > Branches > Add branch protection rule** for `main`:

1. Require a pull request before merging
2. Require status checks to pass, and select **quality-gate**
3. Require branches to be up to date before merging
4. Do not allow bypassing the above settings

Then create environments **staging** and **production** under **Settings > Environments**, and add
required reviewers to `production` for a manual approval step.

## Notes

- CodeQL on private repos needs GitHub Advanced Security. Public repos get it free.
- Gitleaks on organization-owned repos needs a `GITLEAKS_LICENSE` secret. Personal repos do not.
- Actions are pinned to major versions. For stricter supply-chain security, pin them to commit SHAs.

## Try the gate

1. Create a branch, break a test in `backend/tests/app.test.js`, and open a PR. The merge button stays blocked.
2. Add an unused variable to `frontend/src/App.jsx`. Lint fails.
3. Lower test coverage by deleting tests. The coverage threshold fails.
4. Fix each issue and watch the gate go green.
