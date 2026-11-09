# EAS (Expo Application Services)

**What:** EAS is Expo's cloud. We use three parts of it:

- **Hosting** puts a web build on a public URL (`https://<name>.expo.app`). `eas deploy` uploads a folder; `--prod` makes it the main URL, without it you get a preview URL.
- **Build** makes the Android APK in the cloud (phase 3). Profiles are in `apps/app/eas.json`: `development` (dev client), `preview` (APK for testing), `production`.
- **Update** sends new JavaScript to installed apps without a new APK (phase 3).

**Why:** one account hosts the web app, builds the APK without Android Studio, and ships fixes over the air.

**Where in the repo:**

- `apps/app/eas.json`: build profiles.
- `.github/workflows/ci.yml`, job `deploy-storybook`: runs only after the four check jobs are green (`needs`), so Expo capacity is never spent on code that fails. It builds Storybook and deploys `storybook-static` with `eas deploy`. A pull request gets a preview link as one comment; a push to `main` gets the production deploy. Fork PRs are skipped, and it does nothing until the secret `EXPO_TOKEN` exists. The token is given only to the check and deploy steps, never to the install or build.
- `apps/app/app.json` gets `extra.eas.projectId` from `npx eas-cli init` (needs your login).

**Login and token:** `eas login` is for you at the terminal. CI cannot type a password, so it uses `EXPO_TOKEN`, a secret key from https://expo.dev/settings/access-tokens stored as a GitHub secret.
