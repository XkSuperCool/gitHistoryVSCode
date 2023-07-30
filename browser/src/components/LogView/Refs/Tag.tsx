import { Ref } from '../../../definitions';
import * as React from 'react';
import { AiOutlineTag } from 'react-icons/ai';

export default function TagRef(props: Ref) {
    return (
        <div className="commit-tag-container">
            <div className="refs" title={props.name}>
                <AiOutlineTag />
                <span>{props.name}</span>
            </div>
        </div>
    );
}
