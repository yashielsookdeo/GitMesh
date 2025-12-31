import React, { useState, useCallback, useEffect } from 'react';
import { useWebviewMessages } from './hooks/useWebviewMessages';
import { RepoStatus, MessageToWebview } from './types';
import './App.css';

export const App: React.FC = () => {
  const [repos, setRepos] = useState<RepoStatus[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());

  const handleMessage = useCallback((message: MessageToWebview) => {
    switch (message.type) {
      case 'repoStatusUpdate':
        setRepos(message.data.repos || []);
        break;
      case 'operationProgress':
        console.log('Operation progress:', message.data);
        break;
      case 'operationComplete':
        console.log('Operation complete:', message.data);
        break;
      case 'logMessage':
        console.log('Log:', message.data);
        break;
    }
  }, []);

  const { postMessage } = useWebviewMessages(handleMessage);

  useEffect(() => {
    postMessage({ type: 'fetchRepos' });
  }, [postMessage]);

  const toggleRepoSelection = (repoPath: string) => {
    setSelectedRepos(prev => {
      const next = new Set(prev);
      if (next.has(repoPath)) {
        next.delete(repoPath);
      } else {
        next.add(repoPath);
      }
      return next;
    });
  };

  const handleBulkFetch = () => {
    postMessage({
      type: 'bulkFetch',
      data: {
        operation: 'fetch',
        repoPaths: Array.from(selectedRepos)
      }
    });
  };

  const handleBulkCheckout = () => {
    postMessage({
      type: 'bulkCheckout',
      data: {
        operation: 'checkout',
        repoPaths: Array.from(selectedRepos)
      }
    });
  };

  const handleBulkPush = () => {
    postMessage({
      type: 'bulkPush',
      data: {
        operation: 'push',
        repoPaths: Array.from(selectedRepos)
      }
    });
  };

  const handleBulkReset = () => {
    postMessage({
      type: 'bulkReset',
      data: {
        operation: 'reset',
        repoPaths: Array.from(selectedRepos)
      }
    });
  };

  const selectAll = () => {
    setSelectedRepos(new Set(repos.map(r => r.path)));
  };

  const deselectAll = () => {
    setSelectedRepos(new Set());
  };

  return (
    <div className="app">
      <header className="header">
        <h1>GitMesh Dashboard</h1>
        <button onClick={() => postMessage({ type: 'refreshStatus' })}>
          Refresh
        </button>
      </header>

      <div className="actions">
        <div className="action-group">
          <button onClick={selectAll} disabled={repos.length === 0}>
            Select All
          </button>
          <button onClick={deselectAll} disabled={selectedRepos.size === 0}>
            Deselect All
          </button>
        </div>
        <div className="action-group">
          <button
            onClick={handleBulkFetch}
            disabled={selectedRepos.size === 0}
          >
            Fetch ({selectedRepos.size})
          </button>
          <button
            onClick={handleBulkCheckout}
            disabled={selectedRepos.size === 0}
          >
            Checkout ({selectedRepos.size})
          </button>
          <button
            onClick={handleBulkPush}
            disabled={selectedRepos.size === 0}
          >
            Push ({selectedRepos.size})
          </button>
          <button
            onClick={handleBulkReset}
            disabled={selectedRepos.size === 0}
            className="danger"
          >
            Reset ({selectedRepos.size})
          </button>
        </div>
      </div>

      <div className="repo-list">
        {repos.length === 0 ? (
          <div className="empty-state">
            <p>No Git repositories found in workspace</p>
            <p className="hint">Open a folder containing Git repositories to get started</p>
          </div>
        ) : (
          <table className="repo-table">
            <thead>
              <tr>
                <th></th>
                <th>Repository</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Ahead/Behind</th>
              </tr>
            </thead>
            <tbody>
              {repos.map(repo => (
                <tr key={repo.path}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRepos.has(repo.path)}
                      onChange={() => toggleRepoSelection(repo.path)}
                    />
                  </td>
                  <td className="repo-name">{repo.name}</td>
                  <td>{repo.branch}</td>
                  <td>
                    {repo.isDirty && <span className="badge dirty">Dirty</span>}
                    {repo.hasUntracked && <span className="badge untracked">Untracked</span>}
                    {!repo.isDirty && !repo.hasUntracked && <span className="badge clean">Clean</span>}
                  </td>
                  <td>
                    {repo.ahead > 0 && <span className="ahead">↑{repo.ahead}</span>}
                    {repo.behind > 0 && <span className="behind">↓{repo.behind}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
