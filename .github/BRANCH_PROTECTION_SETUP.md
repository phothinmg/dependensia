# Branch Protection Setup Instructions

This document provides instructions for repository administrators to configure branch protection rules that will improve the OSSF Scorecard rating.

## Required Setup Steps

### 1. Configure SCORECARD_TOKEN Secret

To enable proper branch protection detection by OSSF Scorecard:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SCORECARD_TOKEN`
4. Value: A GitHub Personal Access Token with `repo` scope
5. Click **Add secret**

### 2. Enable Branch Protection Rules

Navigate to **Settings** → **Branches** and add protection rules for the `main` branch:

#### Required Settings:

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals** (minimum 1)
  - ✅ **Require review from CODEOWNERS**
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - ✅ **Required status checks:**
    - `lint` (from CI workflow)
    - `test` (from CI workflow)  
    - `build` (from CI workflow)
    - `type-check` (from CI workflow)
    - `CodeQL` (if using CodeQL)
- ✅ **Require conversation resolution before merging**
- ✅ **Restrict pushes that create files that have a path length longer than this limit** (optional)
- ✅ **Do not allow bypassing the above settings** (recommended)

### 3. Verify Configuration

After setting up branch protection:

1. Create a test pull request
2. Verify that all required status checks appear
3. Confirm that code owner review is required
4. Run the OSSF Scorecard workflow to check improved score

## Expected OSSF Scorecard Improvements

With these settings configured, the following OSSF Scorecard warnings should be resolved:

- ❌ "could not determine whether codeowners review is allowed" → ✅ **Resolved**
- ❌ "no status checks found to merge onto branch 'main'" → ✅ **Resolved**  
- ❌ "PRs are not required to make changes on branch 'main'" → ✅ **Resolved**

## Repository Rules Alternative

As an alternative to Branch Protection Rules, you can use the newer **Repository Rules** feature:

1. Go to **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset**
3. Configure similar restrictions using the Repository Rules interface
4. Repository Rules are always public and may provide better OSSF Scorecard detection

Repository Rules are recommended as they provide better transparency and are always publicly visible, which helps with OSSF Scorecard evaluation.