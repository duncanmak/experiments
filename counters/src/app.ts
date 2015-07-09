import _       = require('lodash');
import React   = require('react');
import Rx      = require('rx');
import Actions = require('./actions');

var DOM = React.DOM;

class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props, undefined);
    }

    handleIncrement = () => {
        Actions.numbers.onNext(this.props.counter + 1);
    }

    render = () => {
        return DOM.div(
            {},
            DOM.div({}, `This is a counter: ${this.props.counter}`),
            DOM.button({ onClick: this.handleIncrement }, 'increment')
        );
    }
}

export = App;

