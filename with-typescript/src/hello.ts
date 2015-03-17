import React = require("react");
import _     = require('underscore');

var DOM = React.DOM;

interface HelloProps { label: string  }
interface HelloState { counter: number }

class Hello extends React.Component<HelloProps, HelloState> {

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

    onTestClicked = (evt) => console.log(this.state.counter);

    renderTest = () =>
        DOM.button(
            { key: 4, onClick: this.onTestClicked },
            "Test"
        )

    render() {
        return DOM.p({}, [
            _.map(this.props.label.split(" "), word => DOM.div({}, word.toUpperCase())),
            this.renderCounter(),
            this.renderClicker(),
            this.renderReset(),
            this.renderTest()
        ]);

    }
}

export = Hello;
