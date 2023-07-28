import { Ref } from '../../../definitions';
import * as React from 'react';
import { FiMonitor } from 'react-icons/fi';

export default function HeadRef(props: Ref) {
    return (
        <div className="commit-head-container">
            <div className="refs" title={props.name}>
                <FiMonitor />
                {props.name}
            </div>
        </div>
    );
}
