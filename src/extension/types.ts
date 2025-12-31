import * as vscode from 'vscode';

export interface RepoStatus {
  path: string;
  name: string;
  branch: string;
  isDirty: boolean;
  ahead: number;
  behind: number;
  hasUntracked: boolean;
  lastUpdated: number;
}

export interface GitResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}

export interface OperationProgress {
  repoPath: string;
  operation: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  error?: string;
}

export interface BulkOperationRequest {
  operation: 'fetch' | 'checkout' | 'push' | 'reset';
  repoPaths: string[];
  options?: {
    branch?: string;
    resetMode?: 'soft' | 'mixed' | 'hard';
    resetCount?: number;
  };
}

export interface MessageToWebview {
  type: 'repoStatusUpdate' | 'operationProgress' | 'operationComplete' | 'logMessage';
  data: any;
}

export interface MessageFromWebview {
  type: 'fetchRepos' | 'bulkFetch' | 'bulkCheckout' | 'bulkPush' | 'bulkReset' | 'refreshStatus';
  data?: any;
}
