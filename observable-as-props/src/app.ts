import * as React from 'react';
import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';

const RxDOM = require('rx-dom');
const floatLeft = { style: { float: 'left' } };

interface Props {
    name: string;
    values: any;
}

class ViewComponent<P extends Props> extends Component<P, any> {
    constructor(props: any) {
        super(props);
        this.state = { values: [] };
    }

    values() { return this.props.values; }

    render() {
        console.log('render', this.props.name, this.values());
        return DOM.div(
            {},
            DOM.ul(
                floatLeft,
                DOM.div({}, this.props.name),
                this.values().map((v: number) => DOM.li({ key: v }, v))));
    }
}

const View = React.createFactory(ViewComponent);

interface ObProps extends Props {
    scheduler: Rx.Scheduler;
    values: Observable<number>;
}

class ObViewComponent extends ViewComponent<ObProps> {
    componentDidMount() {
        this.props.values
            .bufferWithTime(100)
            .observeOn(this.props.scheduler)
            .subscribe(i => {
                this.setState({ values: this.state.values.concat(i) });
            });
    }

   values() { return this.state.values; }
}

const ObView = React.createFactory(ObViewComponent);

interface Input {
    array(): number[];
    hot(): Observable<number>;
    cold(): Observable<number>;
}

const rangeInput = (count: number) => ({
    array: () => range(0, count),
    hot: () => Observable.interval(1).take(count),
    cold: () => Observable.range(0, count)
});

export default class App extends Component<any, any> {

    input: Input;

    constructor(props: any) {
        super(props);
        this.input = rangeInput(50);
    }

    render() {
        let RAF     = RxDOM.Scheduler.requestAnimationFrame;
        let timeout = Scheduler.timeout;

        return DOM.div(
            {},
            View(  { name: 'array',        values: this.input.array() }),
            ObView({ name: 'cold RAF',     values: this.input.cold(), scheduler: RAF }),
            ObView({ name: 'hot RAF',      values: this.input.hot(),  scheduler: RAF }),
            ObView({ name: 'cold timeout', values: this.input.cold(), scheduler: timeout }),
            ObView({ name: 'hot timeout',  values: this.input.hot(),  scheduler: timeout })
        )}
};