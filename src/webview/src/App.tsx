import React, { useState, useCallback, useEffect } from 'react';
import { useWebviewMessages } from './hooks/useWebviewMessages';
import { RepoStatus, CommitInfo, MessageToWebview } from './types';
import { RepositoryCard } from './components/RepositoryCard';
import { RefreshIcon } from './components/Icons';
import './App.css';

export const App: React.FC = () => {
  const [repos, setRepos] = useState<RepoStatus[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const [gitTrees, setGitTrees] = useState<Map<string, CommitInfo[]>>(new Map());
  const [loadingTrees, setLoadingTrees] = useState<Set<string>>(new Set());

  const handleMessage = useCallback((message: MessageToWebview) => {
    switch (message.type) {
      case 'repoStatusUpdate':
        setRepos(message.data.repos || []);
        break;
      case 'gitTreeUpdate':
        setGitTrees(prev => {
          const next = new Map(prev);
          next.set(message.data.repoPath, message.data.commits);
          return next;
        });
        setLoadingTrees(prev => {
          const next = new Set(prev);
          next.delete(message.data.repoPath);
          return next;
        });
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

  const toggleRepoExpand = (repoPath: string) => {
    setExpandedRepos(prev => {
      const next = new Set(prev);
      if (next.has(repoPath)) {
        next.delete(repoPath);
      } else {
        next.add(repoPath);
        // Fetch git tree if not already loaded
        if (!gitTrees.has(repoPath) && !loadingTrees.has(repoPath)) {
          setLoadingTrees(loading => {
            const nextLoading = new Set(loading);
            nextLoading.add(repoPath);
            return nextLoading;
          });
          postMessage({
            type: 'fetchGitTree',
            data: { repoPath, count: 15 }
          });
        }
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
        <div className="header-left">
          <h1>GitMesh</h1>
          <span className="repo-count">{repos.length} repositories</span>
        </div>
        <button className="icon-button" onClick={() => postMessage({ type: 'refreshStatus' })} title="Refresh">
          <RefreshIcon />
        </button>
      </header>

      <div className="action-bar">
        <div className="selection-controls">
          <button className="secondary" onClick={selectAll} disabled={repos.length === 0}>
            Select All
          </button>
          <button className="secondary" onClick={deselectAll} disabled={selectedRepos.size === 0}>
            Clear
          </button>
          {selectedRepos.size > 0 && (
            <span className="selection-count">{selectedRepos.size} selected</span>
          )}
        </div>
        <div className="bulk-actions">
          <button onClick={handleBulkFetch} disabled={selectedRepos.size === 0}>
            Fetch
          </button>
          <button onClick={handleBulkCheckout} disabled={selectedRepos.size === 0}>
            Checkout
          </button>
          <button onClick={handleBulkPush} disabled={selectedRepos.size === 0}>
            Push
          </button>
          <button className="danger" onClick={handleBulkReset} disabled={selectedRepos.size === 0}>
            Reset
          </button>
        </div>
      </div>

      <div className="repo-list">
        {repos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No repositories found</h2>
            <p>Open a folder containing Git repositories to get started</p>
          </div>
        ) : (
          repos.map(repo => (
            <RepositoryCard
              key={repo.path}
              repo={repo}
              isSelected={selectedRepos.has(repo.path)}
              isExpanded={expandedRepos.has(repo.path)}
              commits={gitTrees.get(repo.path) || []}
              isLoadingTree={loadingTrees.has(repo.path)}
              onToggleSelect={() => toggleRepoSelection(repo.path)}
              onToggleExpand={() => toggleRepoExpand(repo.path)}
            />
          ))
        )}
      </div>
    </div>
  );
};
