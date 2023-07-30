import { Ref } from '../../../definitions';
import * as React from 'react';
import { AiOutlineCloud } from 'react-icons/ai';

export default function RemoteRef(props: Ref) {
    return (
        <div className="commit-remote-container">
            <div className="refs" title={props.name}>
                <AiOutlineCloud />
                <span>{props.name}</span>
            </div>
        </div>
    );
}
