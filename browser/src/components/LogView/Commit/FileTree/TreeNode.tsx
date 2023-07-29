import * as React from 'react';
import { FileTreeNode } from './index';
import { CommittedFile, Status } from '../../../../definitions';
import {
    AiOutlineRight,
    AiOutlineDown,
    AiOutlineFolder,
    AiFillPlusCircle,
    AiFillMinusCircle,
    AiFillMediumCircle,
    AiFillTrademarkCircle,
    AiFillCopyrightCircle,
} from 'react-icons/ai';
import { IconType } from 'react-icons/lib';

interface TreeNodeProps {
    data: FileTreeNode;
    indent?: number;
}

export class TreeNode extends React.Component<TreeNodeProps> {
    state = {
        expanded: true,
    };

    private renderFileStatusIcon = () => {
        const data = this.props.data as CommittedFile;
        let Icon: IconType;
        let color: string;
        switch (data.status) {
            case Status.Added:
                color = 'var(--vscode-gitDecoration-addedResourceForeground)';
                Icon = AiFillPlusCircle;
                break;
            case Status.Copied:
                color = '#FFC107';
                Icon = AiFillCopyrightCircle;
                break;
            case Status.Deleted:
                color = 'var(--vscode-gitDecoration-deletedResourceForeground)';
                Icon = AiFillMinusCircle;
                break;
            case Status.Modified:
                color = 'var(--vscode-gitDecoration-modifiedResourceForeground)';
                Icon = AiFillMediumCircle;
                break;
            case Status.Renamed:
                color = 'var(--vscode-gitDecoration-renamedResourceForeground)';
                Icon = AiFillTrademarkCircle;
                break;
        }
        return Icon ? <Icon style={{ color }} /> : null;
    };

    private onChangeExpanded = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    public render() {
        return (
            <div>
                <div
                    className="tree-node"
                    style={{ paddingLeft: `${this.props.indent * 14}px` }}
                    onClick={this.onChangeExpanded}
                >
                    {this.state.expanded ? (
                        <AiOutlineDown
                            className="tree-node-icon"
                            style={{ opacity: this.props.data.directory ? 1 : 0 }}
                        />
                    ) : (
                        <AiOutlineRight
                            className="tree-node-icon"
                            style={{ opacity: this.props.data.directory ? 1 : 0 }}
                        />
                    )}
                    {this.props.data.directory ? <AiOutlineFolder /> : this.renderFileStatusIcon()}
                    <span className="tree-node-name" title={this.props.data.name}>
                        {this.props.data.name}
                    </span>
                </div>
                {this.props.data.directory &&
                    this.state.expanded &&
                    this.props.data.children.map(node => (
                        <TreeNode data={node} key={node.name} indent={(this.props.indent || 0) + 1} />
                    ))}
            </div>
        );
    }
}
