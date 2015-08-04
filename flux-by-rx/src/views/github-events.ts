import * as React from 'react';
import { DOM } from 'react';

export class GitHubEvents extends React.Component<any, any> {
    render() {
        let style = { float: 'left' };
        let { state } = this.props;

        return DOM.div(
            { style },
            DOM.label({}, `${this.props.name} ${this.props.data.length}`),
            DOM.ol({}, this.props.data.map(this.renderItem)))
    }

    renderItem(i: any, key: number) {
        return DOM.li({ key },
            DOM.b({}, i.type),
            DOM.a({ href: i.repo.url }, i.repo.name),
            DOM.div({}, i.created_at) );
    }
}