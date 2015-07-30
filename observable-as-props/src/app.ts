import { Component, DOM, createFactory } from 'react';
import { Observable, Scheduler } from 'rx';
import { range } from 'lodash';
import { ArrayContainer, SingleObservableContainer, MultipleObservablesContainer } from './containers';
import { List, Grid } from './views';
import { Options } from 'request';
import { retrieve } from './retrieve';

const RxDOM = require('rx-dom');

var makeArrayContainer = createFactory(ArrayContainer);
var makeMultipleObservablesContainer = createFactory(MultipleObservablesContainer);
var makeSingleObservableContainer = createFactory(SingleObservableContainer);

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
        this.input = rangeInput(100);
    }

    render() {
        // return this.renderList();
        return this.renderConcurrently();
    }

    renderList() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;

        return DOM.div(
            {},
            makeArrayContainer({ data: this.input.array() }, List({ name: 'array' })),
            makeSingleObservableContainer({ data: this.input.cold(), scheduler }, List({ name: 'cold RAF' })),
            makeSingleObservableContainer({ data: this.input.hot(), scheduler }, List({ name: 'hot RAF' })));
    }

    renderGrid() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;
        let timeout = Scheduler.timeout;
        let data = retrieve(numbers('http://localhost:8080/numbers'));

        return DOM.div(
            {},
            makeSingleObservableContainer({ data, scheduler }, Grid({ name: 'hot RAF!' })));
    }

    renderConcurrently() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;

        function oddEven(o: Observable<number>) {
            let odd = o.filter((n: number) => (n % 2 != 0));
            let even = o.filter((n: number) => (n % 2 == 0));
            return { odd, even };
        }

        let array = this.input.array(), cold = this.input.cold(), hot = this.input.hot();

        let arrayC = makeArrayContainer({ data: array }, List({ name: 'array' }));
        let coldC = makeSingleObservableContainer({ data: cold, scheduler }, List({ name: 'cold RAF' }));
        let hotC = makeSingleObservableContainer({ data: hot, scheduler }, List({ name: 'hot RAF' }));
        let multC = makeMultipleObservablesContainer({ data: oddEven(hot), scheduler },
            List({ name: 'Odd numbers', ref: 'odd' }),
            List({ name: 'Even numbers', ref: 'even' }));

        return DOM.div({}, arrayC, coldC, hotC, multC);
    }
}