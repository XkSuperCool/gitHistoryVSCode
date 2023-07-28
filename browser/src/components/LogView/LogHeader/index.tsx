import * as React from 'react';

class LogHeader extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="log-header">
                <div className="title">BRANCH / TAG</div>
                <div className="title" style={{ flex: 1 }}>
                    GRAPH
                </div>
                <div className="title" style={{ flex: 3 }}>
                    COMMIT MESSAGE
                </div>
                <div className="title">AUTHOR</div>
                <div className="title">CHANGES</div>
                <div className="title">COMMIT DATE / TIME</div>
                <div className="title">SHA</div>
            </div>
        );
    }
}

export default LogHeader;
