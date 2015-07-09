import React = require('react');

var DOM = React.DOM;

class Bar extends React.Component<any, any> {
    render () {
        return DOM.div(
            {},
            "This is Bar");
    }
}

export = Bar;
