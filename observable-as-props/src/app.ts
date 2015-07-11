import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';
import { View, ObView } from './views';

const RxDOM = require('rx-dom');

interface Input {
    array(): number[];
    hot(): Observable<number>;
    cold(): Observable<number>;
}

const rangeInput = (count: number) => ({
    array: () => range(0, count),
    hot:   () => Observable.interval(1).take(count),
    cold:  () => Observable.range(0, count)
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
            ObView({ name: 'hot RAF',      values: this.input.hot(),  scheduler: RAF })
         // ObView({ name: 'cold timeout', values: this.input.cold(), scheduler: timeout }),
         // ObView({ name: 'hot timeout',  values: this.input.hot(),  scheduler: timeout })
        )}
};