import * as React from 'react';
import { TreeNode } from './TreeNode';
import { CommittedFile } from 'src/definitions';

interface FileTreeProps {
    data: FileTreeNode[];
}

export type FileTreeDirNode = { directory: true; name: string; children: FileTreeNode[] };
export type FileTreeNode = (CommittedFile & { directory?: false; name: string }) | FileTreeDirNode;

export class FileTree extends React.Component<FileTreeProps> {
    public render() {
        return (
            <div>
                {this.props.data.map(node => (
                    <TreeNode data={node} key={node.name} />
                ))}
            </div>
        );
    }
}
