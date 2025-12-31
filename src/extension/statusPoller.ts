import * as vscode from 'vscode';
import * as path from 'path';
import { GitRunner } from './gitRunner';
import { RepoStatus } from './types';

export class StatusPoller {
  private pollingInterval: NodeJS.Timeout | undefined;
  private repos: string[] = [];
  private statusCache: Map<string, RepoStatus> = new Map();

  constructor(
    private readonly gitRunner: GitRunner,
    private readonly outputChannel: vscode.OutputChannel,
    private readonly onStatusUpdate: (statuses: RepoStatus[]) => void
  ) {}

  setRepos(repos: string[]) {
    this.repos = repos;
    this.statusCache.clear();
  }

  async pollOnce(): Promise<RepoStatus[]> {
    const statuses: RepoStatus[] = [];

    for (const repoPath of this.repos) {
      try {
        const status = await this.getRepoStatus(repoPath);
        statuses.push(status);
        this.statusCache.set(repoPath, status);
      } catch (error) {
        if (error instanceof Error) {
          this.outputChannel.appendLine(
            `[StatusPoller] Error polling ${repoPath}: ${error.message}`
          );
        }
      }
    }

    return statuses;
  }

  startPolling(intervalMs: number = 5000) {
    this.stopPolling();

    this.outputChannel.appendLine(
      `[StatusPoller] Starting polling with ${intervalMs}ms interval`
    );

    this.pollingInterval = setInterval(async () => {
      const statuses = await this.pollOnce();
      this.onStatusUpdate(statuses);
    }, intervalMs);

    this.pollOnce().then(statuses => {
      this.onStatusUpdate(statuses);
    });
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
      this.outputChannel.appendLine('[StatusPoller] Stopped polling');
    }
  }

  private async getRepoStatus(repoPath: string): Promise<RepoStatus> {
    const result = await this.gitRunner.runGit(repoPath, [
      'status',
      '--porcelain',
      '-b'
    ]);

    const lines = result.stdout.split('\n').filter(line => line.trim());
    
    let branch = 'unknown';
    let ahead = 0;
    let behind = 0;
    let isDirty = false;
    let hasUntracked = false;

    if (lines.length > 0) {
      const branchLine = lines[0];
      
      if (branchLine.startsWith('## ')) {
        const branchInfo = branchLine.substring(3);
        const parts = branchInfo.split('...');
        
        if (parts.length > 0) {
          branch = parts[0].split(' ')[0];
        }

        const aheadMatch = branchInfo.match(/ahead (\d+)/);
        const behindMatch = branchInfo.match(/behind (\d+)/);
        
        if (aheadMatch) {
          ahead = parseInt(aheadMatch[1], 10);
        }
        if (behindMatch) {
          behind = parseInt(behindMatch[1], 10);
        }
      }

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('??')) {
          hasUntracked = true;
        } else if (line.trim().length > 0) {
          isDirty = true;
        }
      }
    }

    return {
      path: repoPath,
      name: path.basename(repoPath),
      branch,
      isDirty,
      ahead,
      behind,
      hasUntracked,
      lastUpdated: Date.now()
    };
  }

  dispose() {
    this.stopPolling();
  }
}
