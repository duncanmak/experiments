import React = require("react");
import _     = require('underscore');

var DOM = React.DOM;

interface HelloState { counter: number }

class Hello extends React.Component<any, HelloState> {

    constructor (props) {
        super(props, undefined);
        this.state = { counter: 0 };
    }

    renderCounter = () => DOM.p({ key: 1 }, this.state.counter);

    renderClicker = () =>
        DOM.button(
            { key: 2, onClick: evt => this.setState({ counter: this.state.counter + 1 }) },
            "Click me"
        );

    renderReset = () =>
        DOM.button(
            { key: 3, onClick: evt => this.setState({ counter: 0 }) },
            "Reset"
        );

    renderTest = () =>
        DOM.button(
            { key: 4, onClick: evt => new Error () },
            "Test"
        );

    render() {
        return DOM.p({}, [
            _.map("now with typescript".split(" "), word => DOM.div({}, word.toUpperCase())),
            this.renderCounter(),
            this.renderClicker(),
            this.renderReset(),
            this.renderTest()
        ]);

    }
}

export = Hello;
