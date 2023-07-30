import * as React from 'react';
import { TreeNode } from './TreeNode';
import { CommittedFile } from 'src/definitions';

interface FileTreeProps {
    data: FileTreeNode[];
    onAction: (CommittedFile, string) => void;
}

export type FileTreeDirNode = { directory: true; name: string; children: FileTreeNode[] };
export type FileTreeNode = (CommittedFile & { directory?: false; name: string }) | FileTreeDirNode;

interface FileTreeState {
    selected?: FileTreeNode;
}

export class FileTree extends React.Component<FileTreeProps, FileTreeState> {
    public render() {
        return (
            <div>
                {this.props.data.map(node => (
                    <TreeNode
                        data={node}
                        key={node.name}
                        selected={this.state?.selected}
                        onSelect={node => this.setState({ selected: node })}
                        onAction={this.props.onAction}
                    />
                ))}
            </div>
        );
    }
}
