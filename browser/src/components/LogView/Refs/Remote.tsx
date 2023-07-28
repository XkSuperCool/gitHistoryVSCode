import { Ref } from '../../../definitions';
import * as React from 'react';

export default function RemoteRef(props: Ref) {
    return (
        <div className="commit-remote-container">
            <div className="refs" title={props.name}>
                {props.name}
            </div>
        </div>
    );
}
