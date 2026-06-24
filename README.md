# LaunchPad

A Windows desktop CRM for tracking merchant onboarding projects with optional Supabase synchronization.

## What It Does

- Imports `.xlsx` queue files with the important fields:
  - DBA Name
  - MID
  - Task Name
  - SkyTabCSM_Stage
  - Last CSMTouch Point Note
  - Order Start Date
  - Programming Type
- Stores additional CRM fields locally:
  - Merchant name and email
  - Sales rep name and email
- Shows merchant projects in both Kanban and list views.
- Generates copy-ready email text from templates using merchant/project data.
- Stores data locally in the app user-data folder as `merchants.json`.

## Run From Source

```powershell
npm install
npm start
```

If `npm start` reports that Electron failed to install correctly, delete `node_modules`, run `npm install` again, and then run `npm start`.

## Install The Built App

Build the NSIS installer:

```powershell
npm run build
```

Run `LaunchPad-Setup-<version>.exe`. Installed builds check GitHub Releases automatically and prompt before downloading and installing a newer version. Merchant data is stored separately from application binaries and is not removed by updates.

## Publish An Update

```powershell
npm version patch --no-git-tag-version
git add package.json package-lock.json
git commit -m "Release LaunchPad <version>"
git tag v<version>
git push origin main --tags
```

The `.github/workflows/release.yml` workflow builds the installer, blockmap, and `latest.yml`, then publishes them to GitHub Releases. Existing installed copies will detect that release.
