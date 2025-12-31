import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { GitResult, CommitInfo } from './types';

export class GitRunner {
  constructor(private readonly outputChannel: vscode.OutputChannel) { }

  async runGit(
    repoPath: string,
    args: string[],
    options?: {
      cwd?: string;
      cancellationToken?: vscode.CancellationToken;
    }
  ): Promise<GitResult> {
    const startTime = Date.now();
    const cwd = options?.cwd || repoPath;

    this.outputChannel.appendLine(
      `[GitRunner] Running: git ${this.sanitizeArgs(args).join(' ')} in ${cwd}`
    );

    return new Promise((resolve, reject) => {
      const gitProcess = spawn('git', args, {
        cwd,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      gitProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      gitProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const cleanup = () => {
        if (options?.cancellationToken) {
          options.cancellationToken.onCancellationRequested(() => {
            gitProcess.kill();
          });
        }
      };

      cleanup();

      gitProcess.on('error', (error) => {
        const duration = Date.now() - startTime;
        this.outputChannel.appendLine(
          `[GitRunner] Error after ${duration}ms: ${error.message}`
        );
        reject(error);
      });

      gitProcess.on('close', (exitCode) => {
        const duration = Date.now() - startTime;
        const result: GitResult = {
          exitCode: exitCode || 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          duration
        };

        this.outputChannel.appendLine(
          `[GitRunner] Completed in ${duration}ms with exit code ${exitCode}`
        );

        if (exitCode !== 0) {
          this.outputChannel.appendLine(
            `[GitRunner] stderr: ${stderr.trim().substring(0, 200)}`
          );
        }

        resolve(result);
      });
    });
  }

  async getGitLog(repoPath: string, count: number = 20): Promise<CommitInfo[]> {
    const DELIMITER = '|||';
    const format = `%H${DELIMITER}%h${DELIMITER}%s${DELIMITER}%an${DELIMITER}%ar${DELIMITER}%D`;

    const result = await this.runGit(repoPath, [
      'log',
      `--format=${format}`,
      `-n`,
      count.toString()
    ]);

    if (result.exitCode !== 0) {
      this.outputChannel.appendLine(`[GitRunner] Failed to get git log: ${result.stderr}`);
      return [];
    }

    const commits: CommitInfo[] = [];
    const lines = result.stdout.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const parts = line.split(DELIMITER);
      if (parts.length >= 5) {
        const refs = parts[5] ? parts[5].split(', ').filter(r => r.trim()) : [];
        commits.push({
          hash: parts[0],
          shortHash: parts[1],
          message: parts[2],
          author: parts[3],
          relativeDate: parts[4],
          refs
        });
      }
    }

    return commits;
  }

  private sanitizeArgs(args: string[]): string[] {
    return args.map(arg => {
      if (arg.includes('token') || arg.includes('password') || arg.includes('key')) {
        return '[REDACTED]';
      }
      return arg;
    });
  }
}

