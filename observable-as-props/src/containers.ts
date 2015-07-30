import * as React from 'react';
import { Component, DOM, createFactory, Children, cloneElement } from 'react';
import { Observable } from 'rx';

export interface Values<T> {
    value: T;
}

class ArrayContainerComponent<T> extends React.Component<Values<T>, any> {
    render() {
        let children = (<React.Props<any>>this.props).children;

        let child = <React.ReactElement<any>> Children.only(children);
        return cloneElement(child, this.props);
    }
}
export const ArrayContainer = createFactory(ArrayContainerComponent);

interface ObservableValues<T> extends React.Props<any> {
    source: Observable<T>;
    scheduler: Rx.Scheduler;
}

class ObservableContainerComponent<T> extends React.Component<ObservableValues<T>, Values<T>> {
    constructor(props: ObservableValues<T>) {
        super(props);
        this.state = { value: [] };
    }

    componentDidMount() {
        this.props.source
            .bufferWithTime(20) // TODO: Replace this with a rAF timer?
            .observeOn(this.props.scheduler)
            .subscribe(i => {
                this.setState({ value: this.state.value.concat(i) });
            });
    }

    render() {
        let child = <React.ReactElement<any>> Children.only(this.props.children);
        return cloneElement(child, this.state);
    }
}

export const ObservableContainer = createFactory(ObservableContainerComponent);

interface MultipleObservableValues<T> extends React.Props<any> {
    values: Observable<Observable<T>>;
    scheduler: Rx.Scheduler;
}

class MultipleObservablesContainerComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        let child = <React.ReactElement<any>> Children.only(this.props.children);
        return cloneElement(child, this.state);
    }
}

export const MultipleObservablesContainer = createFactory(MultipleObservablesContainerComponent);