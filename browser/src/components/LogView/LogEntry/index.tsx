import * as React from 'react';
import { connect } from 'react-redux';
import * as dayjs from 'dayjs';
import { LogEntry, Ref } from '../../../definitions';
import { RootState } from '../../../reducers/index';
import { gitmojify } from '../gitmojify';
import ChangeBar from './ChangesBar';
import copyText from '../../../actions/copyText';
import { FiCopy } from 'react-icons/fi';

type ResultListProps = {
    logEntry: LogEntry;
    selected?: LogEntry;
    isLoadingCommit?: string;
    onViewCommit(entry: LogEntry): void;
    onAction(entry: LogEntry, name: string): void;
    onRefAction(logEntry: LogEntry, ref: Ref, name: string): void;
};

class LogEntryView extends React.Component<ResultListProps, {}> {
    constructor(props?: ResultListProps, context?: any) {
        super(props, context);
    }

    private isLoading() {
        return this.props.isLoadingCommit === this.props.logEntry.hash.full;
    }

    private showLoading() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="#d4d4d4">
                <circle cx="5" cy="5" r="1">
                    <animate
                        attributeName="r"
                        begin="0s"
                        dur="1s"
                        values="1;5;1"
                        calcMode="linear"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="fill-opacity"
                        begin="0s"
                        dur="1s"
                        values=".3;1;.3"
                        calcMode="linear"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        );
    }

    public render() {
        const isActive =
            this.props.logEntry &&
            this.props.selected &&
            this.props.selected.hash.full === this.props.logEntry.hash.full;
        let cssClassName = `log-entry ${this.props.logEntry.parents.length > 1 ? 'log-entry-gray' : ''}
                                 ${isActive ? 'active' : ''}`;

        if (this.isLoading()) {
            cssClassName += ' loading';
        }
        function handleClickAndPreventPropagation(handler: Function) {
            return function(event: React.MouseEvent<HTMLElement, MouseEvent>) {
                event.preventDefault();
                event.stopPropagation();
                handler();
            };
        }

        function preventPropagation(event: React.MouseEvent<HTMLElement, MouseEvent>) {
            event.preventDefault();
            event.stopPropagation();
        }
        return (
            <div className={cssClassName} onClick={() => this.props.onViewCommit(this.props.logEntry)}>
                <div className="log-entry-item commit-subject" title={gitmojify(this.props.logEntry.subject)}>
                    {gitmojify(this.props.logEntry.subject)}
                    <span style={{ marginLeft: '.5em' }}>{this.isLoading() ? this.showLoading() : ''}</span>
                </div>
                <div className="log-entry-item">{this.props.logEntry.author.name}</div>
                <div className="log-entry-item changes-info">
                    {this.props.logEntry.committedFiles.length}
                    <ChangeBar logEntry={this.props.logEntry} />
                </div>
                <div className="log-entry-item">{dayjs(this.props.logEntry.committer.date).fromNow()}</div>
                <div className="log-entry-item">
                    <span
                        className="hash-copy"
                        onClick={e => copyText(e, this.props.logEntry.hash.full)}
                        title="Copy hash to clipboard"
                    >
                        <FiCopy />
                    </span>
                    {this.props.logEntry.hash.short}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: RootState, wrapper: ResultListProps): ResultListProps {
    return {
        ...wrapper,
        isLoadingCommit: state.logEntries.isLoadingCommit,
        selected: state.logEntries.selected,
    };
}

export default connect(mapStateToProps)(LogEntryView);
