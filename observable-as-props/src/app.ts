const RxDom = require('rx-dom');

import * as React from 'react';
import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';

class App extends Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return DOM.div(
            {},
            React.createElement(View, { values: Observable.range(0, 20, Scheduler.immediate) }),
            React.createElement(View, { values: Observable.interval(100).take(20) })
        )}

}

class View extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { values: [] };
    }

    componentDidMount() {
        this.props.values.subscribe((i: number) => {
            this.setState({ values: this.state.values.concat([i]) })
        });
    }

    render() {
        return DOM.ul({}, this.state.values.map((v: number) => DOM.li({ key: v }, v)));
    }
}

export default App;