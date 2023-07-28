import * as React from 'react';
import { FileTreeNode } from './index';
import { CommittedFile, Status } from '../../../../definitions';
import { GoChevronDown, GoFileDirectory, GoPlus, GoDash, GoDiff } from 'react-icons/go';

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
        let Icon: typeof GoPlus;
        switch (data.status) {
            case Status.Added:
                Icon = GoPlus;
                break;
            case Status.Copied:
                break;
            case Status.Deleted:
                Icon = GoDash;
                break;
            case Status.Modified:
                Icon = GoDiff;
                break;
            case Status.Renamed:
                break;
        }
        return Icon ? <Icon /> : null;
    };

    private onChangeExpanded = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    public render() {
        return (
            <div>
                <div
                    className="tree-node"
                    style={{ paddingLeft: `${this.props.indent * 10}px` }}
                    onClick={this.onChangeExpanded}
                >
                    <GoChevronDown className="tree-node-icon" style={{ opacity: this.props.data.directory ? 1 : 0 }} />
                    {this.props.data.directory ? <GoFileDirectory /> : this.renderFileStatusIcon()}
                    <span className="tree-node-name">{this.props.data.name}</span>
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
