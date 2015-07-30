import * as React from 'react';
import { Component, DOM, createFactory, Children, cloneElement } from 'react';
import { Observable } from 'rx';

export interface Values<T> {
    data: T[];
}

class ArrayContainerComponent<T> extends React.Component<Values<T>, any> {
    render() {
        let children = (<React.Props<any>>this.props).children;

        let child = <React.ReactElement<any>> Children.only(children);
        return cloneElement(child, this.props);
    }
}
export const ArrayContainer = createFactory(ArrayContainerComponent);

interface SingleObservableProps<T> extends React.Props<any> {
    data: Observable<T>;
    scheduler: Rx.Scheduler;
}

class SingleObservableContainerComponent<T> extends React.Component<SingleObservableProps<T>, Values<T>> {
    constructor(props: SingleObservableProps<T>) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.props.data
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

export const SingleObservableContainer = createFactory(SingleObservableContainerComponent);

interface MultipleObservablesProps<T> extends React.Props<any> {
    data: { [ref: string]: Observable<T> };
    scheduler: Rx.Scheduler;
}

class MultipleObservablesContainerComponent<T> extends React.Component<MultipleObservablesProps<T>, any> {
    render() {
        let scheduler = this.props.scheduler;
        let body = Children.map(
            this.props.children,
            (child: React.ReactElement<any>) => {
                let data = this.props.data[<string>child.ref];
                return SingleObservableContainer({ data, scheduler }, child);
            });

        return DOM.div({}, body);
    }
}

export const MultipleObservablesContainer = createFactory(MultipleObservablesContainerComponent);