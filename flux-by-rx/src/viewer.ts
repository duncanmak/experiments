import * as React from 'react';
import { DOM } from 'react';
import { get } from 'lodash';
import { pathChanged } from './actions/viewer';

export class Viewer extends React.Component<any, any> {
    render() {
        let { data: { state, action } } = this.props;

        return DOM.div({},
            DOM.div({}, "state " + JSON.stringify(get(state, state.path, state))),
            DOM.div({}, "action " + action),
            DOM.input({ type: 'text', defaultValue: state.path, onChange: (evt) => pathChanged((<any>evt.target).value) }));
    }
}