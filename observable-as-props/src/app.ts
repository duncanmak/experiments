import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';
import { View, ArrayContainer, ObservableContainer } from './views';

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
            ArrayContainer     ({ values: this.input.array() },                View({ name: 'array' })),
            ObservableContainer({ values: this.input.cold(), scheduler: RAF }, View({ name: 'cold RAF' })),
            ObservableContainer({ values: this.input.hot(),  scheduler: RAF }, View({ name: 'hot RAF' }))
        )}
};