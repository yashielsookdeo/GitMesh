# GitHub Actions Workflows

This document explains the CI/CD workflows for the GitMesh VS Code extension.

## Workflows

### 1. Package Extension (`package.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via GitHub Actions UI

**What it does:**
- Tests the extension on Node.js 18.x and 20.x
- Installs dependencies with `npm ci`
- Compiles TypeScript and bundles React webview
- Packages the extension as a `.vsix` file
- Uploads the VSIX as a downloadable artifact (30-day retention)

**Downloading the VSIX:**
1. Go to the Actions tab in your GitHub repository
2. Click on the latest successful workflow run
3. Scroll down to "Artifacts" section
4. Download `gitmesh-vsix`

### 2. Release Extension (`release.yml`)

**Triggers:**
- Push of a tag starting with `v*` (e.g., `v0.1.0`)
- Manual trigger via GitHub Actions UI

**What it does:**
- Compiles and packages the extension
- **Automatically creates a GitHub Release** based on the tag
- Uploads the VSIX to the release assets
- Generates release notes automatically
- Stores VSIX as artifact (90-day retention)

## Creating a Release

The release process is now fully automated via git tags.

### Step 1: Update Version
Update the version in `package.json` and create a tag:

```bash
# Updates version to 0.1.1 and creates a git tag 'v0.1.1'
npm version patch

# OR specific version
npm version 0.2.0
```

### Step 2: Push changes and tags
Pushing the tag triggers the release workflow:

```bash
git push && git push --tags
```

**That's it!** The workflow will run, create a "Release v0.1.1" on GitHub, and attach the `.vsix` file.

## Manual Packaging

To package locally without GitHub Actions:

```bash
# Install dependencies
npm install

# Compile extension
npm run compile

# Package as VSIX
npm run package

# This creates: gitmesh-0.1.0.vsix
```

## Installing the VSIX Locally

### Option 1: VS Code UI
1. Open VS Code
2. Go to Extensions view (Cmd+Shift+X / Ctrl+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select the `.vsix` file

### Option 2: Command Line
```bash
code --install-extension gitmesh-0.1.0.vsix
```

## Troubleshooting

### Workflow fails with "npm ci" error
- Ensure `package-lock.json` is committed to the repository
- Check that all dependencies are properly listed in `package.json`

### VSIX packaging fails
- Verify all required files are included (check `.vscodeignore`)
- Ensure `out/` directory is generated during compilation
- Check that webpack successfully bundles the webview

### "Cannot find module" errors during compilation
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript paths are configured correctly in `tsconfig.json`
- Verify all import statements use correct relative paths

## Workflow Artifacts

- **package.yml**: Artifacts retained for 30 days
- **release.yml**: Artifacts retained for 90 days

To download artifacts:
1. Go to Actions tab
2. Select the workflow run
3. Scroll to "Artifacts" section
4. Click to download

## Version Management

The extension version is managed in `package.json`:

```json
{
  "version": "0.1.0"
}
```

**Versioning guidelines:**
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.0.1): Bug fixes

Update the version before creating a release:

```bash
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```

This updates `package.json` and creates a git tag automatically.
