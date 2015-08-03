import * as React from 'react';
import { DOM } from 'react';

export class GitHubEvents extends React.Component<any, any> {
    render() {
        let style = { float: 'left' };
        return DOM.div(
            { style }, 
            DOM.input({ value: this.props.name }), 
            DOM.ul({}, this.props.data.map((i: any) => this.renderItem(i))))
    }

    renderItem(i: any) {
        return DOM.li({},
            DOM.b({}, i.type),
            DOM.a({ href: i.repo.url }, i.repo.name),
            DOM.div({}, i.created_at) );
    }
}