# Change Log

All notable changes to the "gitmesh" extension will be documented in this file.

## [0.1.0] - 2024-12-31

### Added
- Initial release of GitMesh
- Repository discovery with automatic workspace scanning
- Real-time status polling (5-second interval)
- Bulk fetch operation with `--all --prune` flags
- Bulk checkout operation with branch selection
- Bulk push operation with uncommitted changes validation
- Bulk reset operation with soft/mixed/hard modes
- Concurrency control (5 parallel operations)
- GPG signing compatibility with environment preservation
- Safety confirmations for dangerous operations (hard reset)
- React-based webview dashboard with VS Code theming
- Select all/deselect all functionality
- Repository status badges (clean, dirty, untracked)
- Ahead/behind commit indicators
- Progress tracking for bulk operations

### Security
- Sanitized logging (redacts sensitive arguments)
- No credential or passphrase handling
- Full environment preservation for GPG/SSH signing
- Safe Git command execution using spawn (not shell)
