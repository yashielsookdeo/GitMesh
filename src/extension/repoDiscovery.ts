import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

export class RepoDiscovery {
  private repoCache: Map<string, string> = new Map();
  private watcher: vscode.FileSystemWatcher | undefined;

  constructor(private readonly outputChannel: vscode.OutputChannel) {}

  async discoverRepos(): Promise<string[]> {
    this.outputChannel.appendLine('[RepoDiscovery] Starting repository discovery');
    
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      this.outputChannel.appendLine('[RepoDiscovery] No workspace folders found');
      return [];
    }

    const repos: string[] = [];
    
    for (const folder of workspaceFolders) {
      const folderRepos = await this.scanDirectory(folder.uri.fsPath);
      repos.push(...folderRepos);
    }

    this.repoCache.clear();
    repos.forEach(repo => {
      const name = path.basename(repo);
      this.repoCache.set(repo, name);
    });

    this.outputChannel.appendLine(
      `[RepoDiscovery] Found ${repos.length} repositories`
    );

    return repos;
  }

  private async scanDirectory(
    dirPath: string,
    depth: number = 0,
    maxDepth: number = 5
  ): Promise<string[]> {
    if (depth > maxDepth) {
      return [];
    }

    const repos: string[] = [];

    try {
      const gitPath = path.join(dirPath, '.git');
      const gitExists = await exists(gitPath);

      if (gitExists) {
        const gitStat = await stat(gitPath);
        if (gitStat.isDirectory() || gitStat.isFile()) {
          repos.push(dirPath);
          return repos;
        }
      }

      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          const subPath = path.join(dirPath, entry.name);
          const subRepos = await this.scanDirectory(subPath, depth + 1, maxDepth);
          repos.push(...subRepos);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.outputChannel.appendLine(
          `[RepoDiscovery] Error scanning ${dirPath}: ${error.message}`
        );
      }
    }

    return repos;
  }

  private shouldSkipDirectory(name: string): boolean {
    const skipDirs = [
      'node_modules',
      '.vscode',
      '.idea',
      'dist',
      'build',
      'out',
      'target',
      '.next',
      '.nuxt',
      'vendor',
      '__pycache__'
    ];
    return skipDirs.includes(name) || name.startsWith('.');
  }

  setupWatcher(onChange: () => void) {
    if (this.watcher) {
      this.watcher.dispose();
    }

    this.watcher = vscode.workspace.createFileSystemWatcher('**/.git/**');
    
    this.watcher.onDidCreate(() => {
      this.outputChannel.appendLine('[RepoDiscovery] Git directory created, refreshing');
      onChange();
    });

    this.watcher.onDidDelete(() => {
      this.outputChannel.appendLine('[RepoDiscovery] Git directory deleted, refreshing');
      onChange();
    });
  }

  dispose() {
    if (this.watcher) {
      this.watcher.dispose();
    }
  }
}
