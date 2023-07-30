import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/reducers';
import { LogEntry, Status } from '../../../../../src/types';

interface ChangesBarProps {
    logEntry: LogEntry;
    selected?: LogEntry;
}

interface ChangesBarState {
    logEntryCountInfo: {
        added: number;
        deleted: number;
        modified: number;
        total: number;
    };
}

class ChangesBar extends React.Component<ChangesBarProps, ChangesBarState> {
    state = {
        logEntryCountInfo: {
            added: 0,
            deleted: 0,
            modified: 0,
            total: 0,
        },
    };

    public componentDidUpdate(prevProps: ChangesBarProps) {
        if (prevProps.logEntry !== this.props.logEntry) {
            this.setState({
                logEntryCountInfo: this.getFileCountInfo(),
            });
        }
    }

    public componentDidMount() {
        this.setState({
            logEntryCountInfo: this.getFileCountInfo(),
        });
    }

    private getFileCountInfo() {
        const { committedFiles } = this.props.logEntry;
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

        const total = added + deleted + modified;
        return {
            added,
            deleted,
            modified,
            total,
        };
    }

    public render() {
        const { added, deleted, modified, total } = this.state.logEntryCountInfo;
        const title = [
            added ? `added ${added} files` : '',
            deleted ? `deleted ${deleted} files` : '',
            modified ? `modified ${modified} files` : '',
        ]
            .filter(Boolean)
            .join(', ');
        return (
            <div
                title={title}
                className={`changes-bar ${
                    this.props.selected && this.props.selected.hash.full === this.props.logEntry.hash.full
                        ? 'active'
                        : ''
                }`}
            >
                {!!added && <div className="added" style={{ width: `${(added / total) * 100}%` }}></div>}
                {!!deleted && <div className="deleted" style={{ width: `${(deleted / total) * 100}%` }}></div>}
                {!!modified && <div className="modified" style={{ width: `${(modified / total) * 100}%` }}></div>}
            </div>
        );
    }
}

function mapStateToProps(state: RootState, wrapper: ChangesBarProps): ChangesBarProps {
    return {
        ...wrapper,
        selected: state.logEntries.selected,
    };
}

export default connect(mapStateToProps)(ChangesBar);
