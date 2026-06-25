# LaunchPad

A Windows desktop CRM for tracking merchant onboarding projects with Supabase synchronization.

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
- Stores each approved user's merchant data in a separate Supabase account scope.
- Keeps a per-user local cache for temporary connectivity failures.

## Supabase Setup

Run the complete [`supabase/launchpad_setup.sql`](supabase/launchpad_setup.sql) file in the Supabase SQL Editor after database changes. The script is safe to run again.

If the app shows an error about `public.launchpad_profiles` or `public.launchpad_account_access` missing from the schema cache, the Supabase setup has not been applied to the live project yet. Open Supabase, go to **SQL Editor**, paste the full contents of `supabase/launchpad_setup.sql`, run it, then restart or sync LaunchPad.

App updates do not automatically change Supabase table constraints or policies. When a release includes changes to `supabase/launchpad_setup.sql`, run that SQL once in Supabase before using the new database-backed feature.

The merchant table uses `(user_id, id)` as its primary key so each approved user can have their own database even when two users have merchant records with the same imported ID.

In Supabase, go to **Authentication > URL Configuration** and make sure the **Site URL** is not `localhost`. Set it to `https://github.com/nzarzyck1/Project-Management-CSM/releases/latest`, and add that same URL to **Redirect URLs**. LaunchPad also sends that redirect when creating new accounts, so future email verification links should land on a real page instead of a local development address.

New users sign up in LaunchPad, verify their email through Supabase, and then wait for approval. The owner account can open **... > Manage Users** to grant or revoke normal app access. Approved users can write to their own LaunchPad database.

To share one user's database with a supervisor, the supervisor signs up first. The account owner then opens **... > Share Access**, enters the supervisor's email, and grants read-only access to the owner's database only. Supervisors with access to multiple users can switch between shared databases from the account dropdown under their signed-in email. Row Level Security keeps every user's merchant records isolated unless the owner explicitly shares read-only access.

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
