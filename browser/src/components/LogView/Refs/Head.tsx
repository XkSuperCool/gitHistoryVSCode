import { ISettings, Ref } from '../../../definitions';
import * as React from 'react';
import { connect } from 'react-redux';
import { AiOutlineDesktop, AiOutlineCheck } from 'react-icons/ai';
import { RootState } from 'src/reducers';

interface HeadRefProps extends Ref {
    settings: ISettings;
}

function HeadRef(props: HeadRefProps) {
    return (
        <div className="commit-head-container">
            <div className="refs" title={props.name}>
                {props.settings.branchName === props.name ? <AiOutlineCheck /> : null}
                <AiOutlineDesktop />
                <span>{props.name}</span>
            </div>
        </div>
    );
}

function mapStateToProps(state: RootState, wrapper: Ref): HeadRefProps {
    return {
        ...wrapper,
        settings: state.settings,
    };
}

export default connect(mapStateToProps)(HeadRef);
