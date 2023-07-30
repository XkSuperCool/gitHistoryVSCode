import * as React from 'react';
import { LogEntry, RefType } from '../../../definitions';
import TagRef from '../Refs/Tag';
import HeadRef from '../Refs/Head';
import RemoteRef from '../Refs/Remote';

interface LogBranchAndTagProps {
    logEntries: LogEntry[];
}

class LogBranchAndTag extends React.Component<LogBranchAndTagProps> {
    private renderHeadRef(logEntry: LogEntry) {
        return logEntry.refs
            .filter(ref => ref.type === RefType.Head)
            .map(ref => (
                <HeadRef
                    key={ref.name}
                    // onRemove={() => this.props.onRefAction(this.props.logEntry, ref, 'removeBranch')}
                    // onAction={name => this.props.onRefAction(this.props.logEntry, ref, name)}
                    {...ref}
                />
            ));
    }

    private renderRemoteRefs(logEntry: LogEntry) {
        return logEntry.refs
            .filter(ref => ref.type === RefType.RemoteHead)
            .map(ref => (
                <RemoteRef
                    key={ref.name}
                    // onRemove={() => this.props.onRefAction(this.props.logEntry, ref, 'removeRemote')}
                    {...ref}
                />
            ));
    }

    private renderTagRef(logEntry: LogEntry) {
        return logEntry.refs
            .filter(ref => ref.type === RefType.Tag)
            .map(ref => (
                <TagRef
                    key={ref.name}
                    // onRemove={() => this.props.onRefAction(this.props.logEntry, ref, 'removeTag')}
                    {...ref}
                />
            ));
    }

    public render() {
        if (!Array.isArray(this.props.logEntries)) {
            return null;
        }
        return this.props.logEntries.map(entry => {
            const results = [
                ...this.renderHeadRef(entry),
                ...this.renderTagRef(entry),
                ...this.renderRemoteRefs(entry),
            ].filter(items => items);
            return (
                <div className="log-branch-and-tag">
                    {results.length !== 0 && results[0]}
                    {results.length > 1 && <span className="rest-count">+{results.length - 1}</span>}
                    {results.length > 1 && <div className="rest-container">{...results.slice(1)}</div>}
                </div>
            );
        });
    }
}

export default LogBranchAndTag;
