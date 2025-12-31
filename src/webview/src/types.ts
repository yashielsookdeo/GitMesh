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

export interface OperationProgress {
  repoPath: string;
  operation: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  error?: string;
}

export interface MessageToWebview {
  type: 'repoStatusUpdate' | 'operationProgress' | 'operationComplete' | 'logMessage';
  data: any;
}

export interface MessageFromWebview {
  type: 'fetchRepos' | 'bulkFetch' | 'bulkCheckout' | 'bulkPush' | 'bulkReset' | 'refreshStatus';
  data?: any;
}
