import * as React from 'react';
import { Component, DOM, createFactory, Children, cloneElement } from 'react';
import { Observable } from 'rx';

export interface Values {
    values: number[];
}

class ContainerComponent<P extends React.Props<any>, S> extends React.Component<P, S> {

    shouldComponentUpdate(nextProps: P, nextState: S) {
        return this.props != nextProps || this.state != nextState;
    }

    render() {
        let child = <React.ReactElement<any>> Children.only(this.props.children);
        return cloneElement(child, this.values());
    }

    /* abstract */ values(): Values {
        return undefined;
    }
}

class ArrayContainerComponent extends ContainerComponent<Values, any> {
    values() { return this.props; }
}
export const ArrayContainer = createFactory(ArrayContainerComponent);

interface ObservableValues extends React.Props<any> {
    values: Observable<number>;
    scheduler: Rx.Scheduler;
}

class ObservableContainerComponent extends ContainerComponent<ObservableValues, Values> {
    constructor(props: any) {
        super(props);
        this.state = { values: [] };
    }

    componentDidMount() {
        this.props.values
            .bufferWithTime(20) // TODO: Replace this with a rAF timer?
            .observeOn(this.props.scheduler)
            .subscribe(i => {
                this.setState({ values: this.state.values.concat(i) });
            });
    }

    values() { return this.state; }
}
export const ObservableContainer = createFactory(ObservableContainerComponent);