import * as React from 'react';
import { Component, DOM, createFactory, Children, cloneElement } from 'react';
import { Observable } from 'rx';

interface Props extends React.Props<any> {
    name: string;
    values?: number[]; // optional because of usage in app.ts
}

class ViewComponent extends React.Component<Props, any> {

    render() {
        let time = () => {
            let d = new Date();
            return `${d.getSeconds() }s ${d.getMilliseconds() }ms`;
        };

        console.log(time(), 'render', this.props.name, this.props.values.length);

        return DOM.ul(
            { style: { float: 'left' } },
            DOM.div({}, this.props.name),
            this.props.values.map((v: number) => DOM.li({ key: v }, v)));
    }
}
export const View = createFactory(ViewComponent);

interface Values {
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