import React = require('react');

var DOM = React.DOM;

interface State {
    count: number;
}

class Application extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    displayName = "Application"

    onClick = evt => this.setState({count: this.state.count + 1 });

    render() {
        return DOM.div(
            {},
            DOM.h1({}, `Really ${this.state.count}`),
            DOM.p({}, DOM.button({onClick: this.onClick}, "Click!"))
        );
    }
}

var factory = React.createFactory(Application);

export = factory;
