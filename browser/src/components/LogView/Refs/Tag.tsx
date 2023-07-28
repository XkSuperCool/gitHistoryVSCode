import { Ref } from '../../../definitions';
import * as React from 'react';
import { FiTag } from 'react-icons/fi';

export default function TagRef(props: Ref) {
    return (
        <div className="commit-tag-container">
            <div className="refs" title={props.name}>
                <FiTag />
                {props.name}
            </div>
        </div>
    );
}
