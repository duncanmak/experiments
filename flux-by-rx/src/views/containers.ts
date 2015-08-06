import * as React from 'react';
import { Component, DOM, createFactory, Children, cloneElement, createElement } from 'react';
import { Observable } from 'rx';
import * as Rx from 'rx';

export interface Data<T> { data: T[]; }

interface SingleObservableProps<T> extends React.Props<any> {
    data: Observable<T>;
    scheduler: Rx.Scheduler;
}

export class SingleObservableContainer<T> extends React.Component<SingleObservableProps<T>, Data<T>> {

    subscription: Rx.IDisposable;

    constructor(props: SingleObservableProps<T>) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.subscribe(this.props.data);
    }

    componentWillReceiveProps(newProps: SingleObservableProps<T>) {
        if (newProps !== this.props) {
            this.subscription.dispose();
            this.setState({ data: [] });
            this.subscribe(newProps.data);
        }
    }

    componentWillUnmount() {
        this.subscription.dispose();
    }

    shouldComponentUpdate(nextProps: SingleObservableProps<T>, newState: Data<T>) {
        return newState.data.length > 0;
    }

    subscribe(data: Observable<T>) {
        this.subscription = data
            .bufferWithTime(20) // TODO: Replace this with a rAF timer?
            .observeOn(this.props.scheduler)
            .subscribe(i => {
                this.setState({ data: this.state.data.concat(i) });
            });
    }

    render() {
        let child = <React.ReactElement<any>> Children.only(this.props.children);
        return cloneElement(child, this.state);
    }
}

interface MultipleObservablesProps<T> extends React.Props<any> {
    data: { [ref: string]: Observable<T> };
    scheduler: Rx.Scheduler;
}

export class MultipleObservablesContainer<T> extends React.Component<MultipleObservablesProps<T>, any> {
    render() {
        let scheduler = this.props.scheduler;
        let body = Children.map(
            this.props.children,
            (child: React.ReactElement<any>) => {
                let data = this.props.data[<string>child.ref];
                return createElement(SingleObservableContainer, { data, scheduler }, child);
            });

        return DOM.div({}, body);
    }
}

