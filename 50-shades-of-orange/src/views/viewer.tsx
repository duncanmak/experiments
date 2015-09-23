import * as React from 'react';
import { DOM } from 'react';
import { get } from 'lodash';
import { pathChanged } from '../actions/viewer';

export class Viewer extends React.Component<any, any> {

    onChange = (evt) => pathChanged((evt.target as any).value)

    render() {
        let { data: { state, action } } = this.props;

        return (
            <div>
                <div>state {JSON.stringify(get(state, state.path, state))}</div>
                <input type='text' value={state.path} onChange={this.onChange} />
            </div>
        );
    }
}