import React from 'react';
import { RepoStatus, CommitInfo } from '../types';
import { GitTree } from './GitTree';
import { ChevronIcon, GitBranchIcon, FolderIcon } from './Icons';

interface RepositoryCardProps {
    repo: RepoStatus;
    isSelected: boolean;
    isExpanded: boolean;
    commits: CommitInfo[];
    isLoadingTree: boolean;
    onToggleSelect: () => void;
    onToggleExpand: () => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
    repo,
    isSelected,
    isExpanded,
    commits,
    isLoadingTree,
    onToggleSelect,
    onToggleExpand,
}) => {
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect();
    };

    return (
        <div className={`repo-card ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''}`}>
            <div className="repo-card-header" onClick={onToggleExpand}>
                <div className="repo-card-left">
                    <div className="repo-checkbox" onClick={handleCheckboxClick}>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                        />
                    </div>
                    <div className="repo-icon">
                        <FolderIcon />
                    </div>
                    <div className="repo-info">
                        <div className="repo-name">{repo.name}</div>
                        <div className="repo-branch">
                            <GitBranchIcon />
                            <span>{repo.branch}</span>
                        </div>
                    </div>
                </div>
                <div className="repo-card-right">
                    <div className="repo-status-badges">
                        {repo.isDirty ? (
                            <span className="badge dirty">Modified</span>
                        ) : repo.hasUntracked ? (
                            <span className="badge untracked">Untracked</span>
                        ) : (
                            <span className="badge clean">Clean</span>
                        )}
                    </div>
                    <div className="repo-sync-status">
                        {repo.ahead > 0 && <span className="ahead">↑{repo.ahead}</span>}
                        {repo.behind > 0 && <span className="behind">↓{repo.behind}</span>}
                    </div>
                    <div className="repo-chevron">
                        <ChevronIcon expanded={isExpanded} />
                    </div>
                </div>
            </div>
            <div className={`repo-card-content ${isExpanded ? 'show' : ''}`}>
                <GitTree commits={commits} loading={isLoadingTree} />
            </div>
        </div>
    );
};
