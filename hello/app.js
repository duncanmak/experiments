/*jslint indent: 4, sloppy: true */
/*global React */

var Hello = React.createClass({
    statics: {
        label: 'Hello'
    },

    render: function() {
        return React.DOM.div({}, React.DOM.h1({}, "Bonjour"));
    }
});
