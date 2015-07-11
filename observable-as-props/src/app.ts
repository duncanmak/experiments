import * as React from 'react';
import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';

const RxDOM = require('rx-dom');
const floatLeft = { style: { float: 'left' } };
const num = 50;

class App extends Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        let RAF     = RxDOM.Scheduler.requestAnimationFrame;
        let timeout = Scheduler.timeout;

        return DOM.div(
            {},
            React.createElement(View,   { name: 'array',        values: range(0, num) }),
            React.createElement(ObView, { name: 'sync',         values: Observable.range(0, num),         scheduler: RAF }),
         // React.createElement(ObView, { name: 'async fast',   values: Observable.interval(1).take(num), scheduler: timeout }),
            React.createElement(ObView, { name: 'async smooth', values: Observable.interval(1).take(num), scheduler: RAF })
        )}
}

interface Props {
    name: string;
    values: any;
}

class View<P extends Props> extends Component<P, any> {
    constructor(props: any) {
        super(props);
        this.state = { values: [] };
    }

    values() { return this.props.values; }

    render() {
        // console.log('render', this.props.name);
        return DOM.div(
            {},
            DOM.ul(
                floatLeft,
                DOM.div({}, this.props.name),
                this.values().map((v: number) => DOM.li({ key: v }, v))));
    }
}

interface ObProps extends Props {
    scheduler: Rx.Scheduler;
    values: Observable<number>;
}

class ObView extends View<ObProps> {
    componentDidMount() {
        this.props.values
            .observeOn(this.props.scheduler)
            .bufferWithTime(16)
            .subscribe(i => {
                console.log(this.props.name, i);
                this.setState({ values: this.state.values.concat(i) });
            });
    }

   values() { return this.state.values; }
}

export default App;