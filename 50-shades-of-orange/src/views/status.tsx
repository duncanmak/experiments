import * as React from 'react';
import { Log, Step } from '../wrench-support';

const _ = require('lodash');
const DOM = React.DOM;

export class StatusList extends React.Component<any, any> {

    renderStatus(status) {
        // return JSON.stringify(status, null, 2);
        let keys = Object.keys(status);
        let fields = keys.map(k => <div><b>{k}</b>: <View data={status[k]} /></div>);
        return (
            <li>
              { fields }
            </li>
        );
    }

    render() {
        let style: any = { style: { float: 'left' } };
        return DOM.ul(style, this.props.data.map(this.renderStatus));
    }
}

export class View extends React.Component<any, any> {
    render() {
        if (_.isArray(this.props.data)) {
            // return <div>{Object.keys(this.props.data).join(', ')}</div>;
            // let keys = Object.keys(d).join(', ');
            return <ol>{ this.props.data.map(d => <li>{d.description}</li>) }</ol>;
        }

        return <div>{JSON.stringify(this.props.data, null, 2)}</div>;
    }
}
