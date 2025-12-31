import React from 'react';
import { CommitInfo } from '../types';
import { GitCommitIcon } from './Icons';

interface GitTreeProps {
    commits: CommitInfo[];
    loading?: boolean;
}

export const GitTree: React.FC<GitTreeProps> = ({ commits, loading }) => {
    if (loading) {
        return (
            <div className="git-tree-loading">
                <div className="loading-spinner" />
                <span>Loading commits...</span>
            </div>
        );
    }

    if (commits.length === 0) {
        return (
            <div className="git-tree-empty">
                No commits found
            </div>
        );
    }

    return (
        <div className="git-tree">
            {commits.map((commit, index) => (
                <div key={commit.hash} className="commit-item">
                    <div className="commit-graph">
                        <div className="commit-line top" style={{ opacity: index === 0 ? 0 : 1 }} />
                        <div className="commit-dot">
                            <GitCommitIcon />
                        </div>
                        <div className="commit-line bottom" style={{ opacity: index === commits.length - 1 ? 0 : 1 }} />
                    </div>
                    <div className="commit-content">
                        <div className="commit-header">
                            <span className="commit-hash">{commit.shortHash}</span>
                            {commit.refs.length > 0 && (
                                <div className="commit-refs">
                                    {commit.refs.map((ref, i) => (
                                        <span key={i} className="commit-ref">{ref}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="commit-message">{commit.message}</div>
                        <div className="commit-meta">
                            <span className="commit-author">{commit.author}</span>
                            <span className="commit-date">{commit.relativeDate}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
