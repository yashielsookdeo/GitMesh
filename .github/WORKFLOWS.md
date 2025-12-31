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
- When a GitHub release is created
- Manual trigger via GitHub Actions UI (with optional marketplace publishing)

**What it does:**
- Compiles and packages the extension
- Uploads the VSIX to the GitHub release assets
- Optionally publishes to VS Code Marketplace (if configured)
- Stores VSIX as artifact (90-day retention)

## Setting Up Marketplace Publishing

To enable automatic publishing to the VS Code Marketplace:

### Step 1: Create a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on your profile → Security → Personal Access Tokens
3. Create a new token with:
   - **Name**: `vsce-publish-gitmesh`
   - **Organization**: All accessible organizations
   - **Scopes**: Custom defined → Marketplace → **Manage**
4. Copy the token (you won't see it again!)

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. **Name**: `VSCE_PAT`
5. **Value**: Paste your Azure DevOps PAT
6. Click "Add secret"

### Step 3: Update package.json

Ensure your `package.json` has a valid publisher name:

```json
{
  "publisher": "your-publisher-id"
}
```

To create a publisher:
1. Go to [VS Code Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Create a new publisher
3. Update the `publisher` field in `package.json`

## Creating a Release

### Option 1: GitHub UI

1. Go to your repository → Releases → "Draft a new release"
2. Create a new tag (e.g., `v0.1.0`)
3. Fill in release title and description
4. Click "Publish release"
5. The workflow will automatically:
   - Build the extension
   - Upload VSIX to the release
   - Publish to marketplace (if configured)

### Option 2: Command Line

```bash
# Create and push a tag
git tag v0.1.0
git push origin v0.1.0

# Create release using GitHub CLI
gh release create v0.1.0 --title "v0.1.0" --notes "Release notes here"
```

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

### Marketplace publishing fails
- Verify `VSCE_PAT` secret is set correctly
- Check that the publisher name in `package.json` matches your Azure DevOps publisher
- Ensure the PAT has "Marketplace (Manage)" scope
- Verify the version in `package.json` hasn't been published before

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
