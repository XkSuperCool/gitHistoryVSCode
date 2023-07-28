import * as React from 'react';
import { connect } from 'react-redux';
import { CommittedFile, LogEntry, Status } from '../../../definitions';
import { RootState } from '../../../reducers';
import Author from './Author';
import Avatar from './Avatar';
import { FileTree, FileTreeDirNode, FileTreeNode } from './FileTree';
import { GoX, GoClippy } from 'react-icons/go';
import { ResultActions } from '../../../actions/results';
import { gitmojify } from '../gitmojify';
import copyText from '../../../actions/copyText';

interface CommitProps {
    selectedEntry?: LogEntry;
    theme: string;
    closeCommitView: typeof ResultActions.closeCommitView;
    actionFile: typeof ResultActions.actionFile;
}

interface CommitState {
    searchText: string;
    fileChangedExpanded: boolean;
    fileCountInfo: {
        added: number;
        deleted: number;
        modified: number;
    };
}

class Commit extends React.Component<CommitProps, CommitState> {
    private ref: HTMLInputElement;
    constructor(props: CommitProps) {
        super(props);
        this.state = {
            searchText: '',
            fileChangedExpanded: true,
            fileCountInfo: { added: 0, deleted: 0, modified: 0 },
        };
    }

    public componentDidUpdate(prevProps: CommitProps) {
        if (
            prevProps.selectedEntry &&
            this.props.selectedEntry &&
            this.props.selectedEntry !== prevProps.selectedEntry
        ) {
            this.setState({ searchText: '', fileCountInfo: this.getFileCountInfo() });
        }
        // this.ref.focus();
    }

    public componentDidMount() {
        this.setState({ searchText: '' });
    }

    private onActionFile = (fileEntry: CommittedFile, name) => {
        this.props.actionFile(this.props.selectedEntry, fileEntry, name);
    };
    private onClose = () => {
        this.props.closeCommitView();
    };
    private filesToTrees(committedFiles: CommittedFile[]) {
        const fileTree: FileTreeNode[] = [];
        const nodeMaps: Record<string, FileTreeDirNode> = {};

        for (let i = 0, len = committedFiles.length; i < len; i++) {
            const file = committedFiles[i];
            const paths = file.relativePath.split('/');
            if (paths.length === 1) {
                fileTree.push({
                    ...file,
                    name: paths[0],
                });
            } else {
                let parentNode;
                paths.forEach((path, index) => {
                    const pathKey = paths.slice(0, index + 1).join('/');
                    if (parentNode && index === paths.length - 1) {
                        return parentNode.children.push({
                            ...file,
                            name: path,
                        });
                    }
                    if (!nodeMaps[pathKey]) {
                        const node: FileTreeDirNode = {
                            name: path,
                            children: [],
                            directory: true,
                        };
                        if (parentNode) {
                            parentNode.children.push(node);
                        } else {
                            fileTree.push(node);
                        }
                        parentNode = node;
                        nodeMaps[pathKey] = node;
                    } else {
                        parentNode = nodeMaps[pathKey];
                    }
                });
            }
        }

        function formatFileTree(fileTree: FileTreeNode[], parentNode?: FileTreeDirNode) {
            let sortedFileTree = fileTree;
            let files = [];
            let directories = [];

            if (parentNode && fileTree.length == 1 && fileTree[0].directory) {
                parentNode.name = `${parentNode.name}/${fileTree[0].name}`;
                return formatFileTree(fileTree[0].children);
            }

            for (let i = 0, len = sortedFileTree.length; i < len; i++) {
                const node = sortedFileTree[i];
                if (node.directory) {
                    directories.push(node);
                } else {
                    files.push(node);
                }
            }
            files = files.sort((a, b) => a.name.localeCompare(b.name));
            directories = directories.sort((a, b) => a.name.localeCompare(b.name));
            sortedFileTree = [...directories, ...files];

            for (let i = 0, len = directories.length; i < len; i++) {
                directories[i].children = formatFileTree(directories[i].children, directories[i]);
            }

            return sortedFileTree;
        }

        return formatFileTree(fileTree);
    }
    private renderFileTree() {
        let { committedFiles } = this.props.selectedEntry;
        if (this.state.searchText) {
            committedFiles = committedFiles.filter(
                x => x.relativePath.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1,
            );
        }
        return <FileTree data={this.filesToTrees(committedFiles)} />;
    }
    private getFileCountInfo() {
        const { committedFiles } = this.props.selectedEntry;
        let added = 0,
            deleted = 0,
            modified = 0;

        for (let i = 0, len = committedFiles.length; i < len; i++) {
            const file = committedFiles[i];
            switch (file.status) {
                case Status.Added:
                    added++;
                    break;
                case Status.Deleted:
                    deleted++;
                    break;
                default:
                    modified++;
            }
        }

        return { added, deleted, modified };
    }
    private handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: e.target.value });
    };
    private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' && !this.state.searchText) {
            // close commit view when ESC is pressen (but only when no text given)
            this.onClose();
            return;
        }

        if (e.key === 'Escape') {
            this.setState({ searchText: '' });
        }
    };

    public render() {
        return (
            <div id="detail-view">
                <div className="authorContainer">
                    <div style={{ minWidth: '40px' }}>
                        <Avatar result={this.props.selectedEntry.author}></Avatar>
                    </div>
                    <div className="author-info">
                        <div>{this.props.selectedEntry.author.name}</div>
                        <div>{this.props.selectedEntry.committer.date.toLocaleDateString()}</div>
                    </div>
                    {/* <div className="actions">
                        <input
                            ref={x => {
                                this.ref = x;
                            }}
                            className={'textInput'}
                            type="text"
                            value={this.state.searchText}
                            placeholder="Find file"
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleSearchChange}
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-default hint--bottom-left hint--rounded hint--bounce"
                            aria-label="Close the detail view"
                            onClick={this.onClose}
                        >
                            <GoX />
                        </button>
                    </div> */}
                </div>
                <div className="committed-message">
                    {gitmojify(this.props.selectedEntry.subject)}
                    <div className="commit-body">{gitmojify(this.props.selectedEntry.body)}</div>
                    <div className="commit-notes">{gitmojify(this.props.selectedEntry.notes)}</div>
                </div>
                <div>
                    <div
                        className="detail-view-panel"
                        onClick={() => this.setState({ fileChangedExpanded: !this.state.fileChangedExpanded })}
                    >
                        <strong>FILE CHANGED</strong>
                        <span className="files-added">+{this.state.fileCountInfo.added}</span>
                        <span className="files-modified">~{this.state.fileCountInfo.modified}</span>
                        <span className="files-deleted">-{this.state.fileCountInfo.deleted}</span>
                    </div>
                    <div className="panel-content">{this.state.fileChangedExpanded && this.renderFileTree()}</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    if (state.logEntries) {
        return {
            selectedEntry: state.logEntries.selected,
            theme: state.vscode.theme,
        } as CommitProps;
    }
    return {
        selectedEntry: undefined,
        theme: state.vscode.theme,
    } as CommitProps;
}

function mapDispatchToProps(dispatch) {
    return {
        closeCommitView: () => dispatch(ResultActions.closeCommitView()),
        actionFile: (logEntry: LogEntry, committedFile: CommittedFile, name) =>
            dispatch(ResultActions.actionFile(logEntry, committedFile, name)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commit);
