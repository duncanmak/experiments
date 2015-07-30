import { Component, DOM } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';
import { ArrayContainer, ObservableContainer, MultipleObservablesContainer } from './containers';
import { List, Grid } from './views';
import { Options } from 'request';
import { retrieve } from './retrieve';

const RxDOM = require('rx-dom');

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

function numbers(url: string): Options {
    const token = '';
    return {
        withCredentials: false,
        uri: url,
        headers: { 'User-Agent': 'node', Accept: 'application/json' },
    };
}

export default class App extends Component<any, any> {

    input: Input;

    constructor(props: any) {
        super(props);
        this.input = rangeInput(50);
    }

    render() {
        return this.renderList();
    }

    renderList() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;

        return DOM.div(
            {},
            ArrayContainer({ values: this.input.array() }, List({ name: 'array' })),
            ObservableContainer({ data: this.input.cold(), scheduler }, List({ name: 'cold RAF' })),
            ObservableContainer({ data: this.input.hot(), scheduler }, List({ name: 'hot RAF' })))
    }

    renderGrid() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;
        let timeout = Scheduler.timeout;
        let data = retrieve(numbers('http://localhost:8080/numbers'));

        return DOM.div(
            {},
            ObservableContainer({ data, scheduler }, Grid({ name: 'hot RAF!' })));
    }

    renderConcurrently() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;

        function oddEven(o: Observable<number>) {
            return o.groupBy(
                (n: number) => (n % 2 == 0) ? "even" : "odd",
                (n: number) => n);
        }

        return DOM.div(
            {},
            MultipleObservablesContainer(
                { data: oddEven(this.input.hot()), scheduler },
                List({ name: 'odd', ref: 'odd' }),
                List({ name: 'even', ref: 'even' }))
        );
    }
}