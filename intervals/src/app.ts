import _     = require('lodash');
import React = require('react');
import Rx    = require('rx');

var DOM = React.DOM;

interface State {
    subscription: Rx.Disposable
    aCounter: number;
    bCounter: number;
}

class App extends React.Component<any, State> {

    constructor(props: any) {
        super(props, undefined);
        this.state = { subscription: undefined, aCounter: 0, bCounter: 0 };
    }

    componentDidMount() {
        var source = Rx.Observable.interval(1000).take(500);

        this.setState({
            subscription: source.subscribeOnNext(
                i => this.setState(<State> _.assign(this.state, { aCounter: i }))),
            aCounter: 0,
            bCounter: 0
        });
    }

    componentWillUnmount() {
        this.state.subscription.dispose();
    }

    render() {
        return DOM.h1({}, `This is a counter: ${this.state.aCounter}`);
    }
}

React.render(
    React.createElement(App, {}),
    document.getElementById('app')
);
