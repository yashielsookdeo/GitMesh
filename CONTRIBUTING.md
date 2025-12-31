# Contributing to GitMesh

Thank you for your interest in contributing to GitMesh! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yashielsookdeo/gitmesh.git
   cd gitmesh
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run compile
   ```

4. **Run in Development Mode**
   - Press `F5` in VS Code
   - This opens a new VS Code window with the extension loaded
   - Test your changes in the Extension Development Host

## Project Structure

```
gitmesh/
├── src/extension/          # Extension backend (TypeScript)
│   ├── extension.ts        # Entry point
│   ├── gitRunner.ts        # Git command execution
│   ├── repoDiscovery.ts    # Repository scanning
│   ├── statusPoller.ts     # Status polling
│   ├── operationQueue.ts   # Concurrency control
│   ├── bulkOperations.ts   # Bulk operation handlers
│   └── webviewProvider.ts  # Webview management
├── src/webview/src/        # Webview UI (React)
│   ├── App.tsx             # Main component
│   ├── App.css             # Styling
│   └── hooks/              # Custom React hooks
├── .github/workflows/      # CI/CD workflows
└── out/                    # Compiled output
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow existing code style
- Add comments for complex logic
- Ensure GPG compatibility is preserved
- Add safety gates for dangerous operations

### 3. Test Your Changes

```bash
# Compile
npm run compile

# Run in development mode
# Press F5 in VS Code

# Test the extension thoroughly
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Guidelines

### TypeScript/Extension Code

- Use TypeScript strict mode
- Prefer `async/await` over callbacks
- Use proper error handling with try/catch
- Log important operations to output channel
- Never log sensitive data (credentials, tokens)

### Git Operations

**Critical Requirements:**
- Always use `child_process.spawn` (not `exec`)
- Preserve full environment (`process.env`)
- Use argument arrays (not concatenated strings)
- Support cancellation tokens
- Never hijack stdin/stdout

Example:
```typescript
const gitProcess = spawn('git', ['status', '--porcelain'], {
  cwd: repoPath,
  env: process.env,  // Preserve for GPG
  stdio: ['ignore', 'pipe', 'pipe']
});
```

### React/Webview Code

- Use functional components with hooks
- Use VS Code CSS variables for theming
- Keep components focused and reusable
- Handle loading and error states

### Security

- Sanitize command arguments before logging
- Never log environment variables
- Validate user input
- Add confirmation dialogs for destructive operations

## Testing

### Manual Testing Checklist

- [ ] Extension activates without errors
- [ ] Dashboard opens successfully
- [ ] Repositories are discovered correctly
- [ ] Status updates in real-time
- [ ] Bulk fetch works on multiple repos
- [ ] Bulk checkout prompts for branch name
- [ ] Bulk push validates uncommitted changes
- [ ] Bulk reset shows confirmation for hard reset
- [ ] Progress updates display correctly
- [ ] Errors are handled gracefully

### Testing with GPG Signing

If you use GPG signing:
- [ ] Fetch operations work with GPG-signed commits
- [ ] Push operations trigger GPG signing
- [ ] No passphrase prompts are hijacked

## Pull Request Process

1. **Update Documentation**
   - Update README.md if adding features
   - Update CHANGELOG.md with your changes
   - Add JSDoc comments to new functions

2. **Ensure CI Passes**
   - GitHub Actions must pass
   - Fix any linting errors
   - Ensure compilation succeeds

3. **Request Review**
   - Describe your changes clearly
   - Reference any related issues
   - Explain testing performed

4. **Address Feedback**
   - Respond to review comments
   - Make requested changes
   - Push updates to your branch

## Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a GitHub release
4. GitHub Actions automatically packages and publishes

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing to GitMesh! 🚀
