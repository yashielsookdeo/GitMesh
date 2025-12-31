# GitMesh - Bulk Git Operations for VS Code

![Package Extension](https://github.com/yashielsookdeo/gitmesh/workflows/Package%20Extension/badge.svg)

GitMesh is a VS Code extension that provides a powerful dashboard for managing multiple Git repositories simultaneously. Perform bulk operations like fetch, checkout, push, and reset across all your repositories with ease.

## Features

- **Repository Discovery**: Automatically discovers all Git repositories in your workspace
- **Real-time Status**: Polls repository status every 5 seconds to show current branch, dirty state, and ahead/behind counts
- **Bulk Operations**: Execute Git operations on multiple repositories simultaneously
  - **Fetch**: Fetch from all remotes with `--all --prune`
  - **Checkout**: Switch branches across multiple repositories
  - **Push**: Push changes to remote (with uncommitted changes check)
  - **Reset**: Reset HEAD with soft/mixed/hard modes
- **Concurrency Control**: Limits parallel operations (default: 5 concurrent) to prevent system overload
- **GPG Signing Support**: Preserves environment variables for GPG signing compatibility
- **Safety Gates**: Confirmation dialogs for dangerous operations (e.g., hard reset)
- **Progress Tracking**: Real-time progress updates for each repository

## Usage

### Opening the Dashboard

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type "GitMesh: Open Dashboard"
3. Press Enter

### Performing Bulk Operations

1. Select repositories by clicking the checkboxes in the table
2. Use "Select All" or "Deselect All" buttons for quick selection
3. Click the desired operation button:
   - **Fetch**: Fetches from all remotes
   - **Checkout**: Prompts for branch name, then checks out that branch
   - **Push**: Pushes current branch to remote (checks for uncommitted changes first)
   - **Reset**: Prompts for reset mode and commit count, then resets HEAD

### Understanding Repository Status

- **Branch**: Current branch name
- **Status Badges**:
  - `Clean`: No uncommitted changes
  - `Dirty`: Has uncommitted changes
  - `Untracked`: Has untracked files
- **Ahead/Behind**: Shows how many commits ahead (↑) or behind (↓) the remote

## Requirements

- VS Code 1.85.0 or higher
- Git installed and available in PATH

## Extension Settings

This extension currently has no configurable settings. The polling interval is set to 5 seconds by default, and concurrency limit is 5 operations.

## Security & GPG Signing

GitMesh is designed with security in mind:

- **GPG Compatibility**: Preserves full environment variables (including `GPG_TTY`) for GPG signing
- **No Credential Handling**: Never handles Git credentials or passphrases
- **Safe Logging**: Sanitizes command arguments before logging (redacts tokens, passwords, keys)
- **Environment Preservation**: Uses `child_process.spawn` with full environment to support hardware keys and SSH signing

## Architecture

- **Extension Host**: TypeScript-based VS Code extension
- **Webview UI**: React-based dashboard with VS Code theming
- **Git Runner**: Spawns Git processes with proper environment preservation
- **Operation Queue**: Manages concurrent operations with configurable limits

## Known Limitations

- Does not support commit operations (focus is on fetch, checkout, push, reset)
- Polling interval is not configurable (fixed at 5 seconds)
- Maximum search depth for repository discovery is 5 levels

## Development

### Building from Source

```bash
npm install
npm run compile
```

### Running in Development

Press `F5` in VS Code to launch the Extension Development Host with the extension loaded.

### Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be installed in VS Code.

### CI/CD

The extension uses GitHub Actions for automated building and packaging:

- **Package Workflow**: Runs on every push/PR, creates VSIX artifacts
- **Release Workflow**: Runs on GitHub releases, publishes to marketplace

See [`.github/WORKFLOWS.md`](.github/WORKFLOWS.md) for detailed documentation on:
- Setting up marketplace publishing
- Creating releases
- Downloading artifacts
- Troubleshooting

### Quick Commands

```bash
# Compile and watch for changes
npm run watch

# Package as VSIX
npm run package

# Install locally
code --install-extension gitmesh-0.1.0.vsix
```

## Contributing

Contributions are welcome! Please ensure:

- Code follows existing style
- All operations preserve GPG compatibility
- Dangerous operations have appropriate safety gates

## License

MIT

## Changelog

### 0.1.0

- Initial release
- Repository discovery and status polling
- Bulk operations: fetch, checkout, push, reset
- GPG signing support
- Concurrency control
- Safety confirmations for dangerous operations
