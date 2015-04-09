/*global require, module */

var React = require('react');

module.exports = React.createClass({

    displayName: "Application",
    render: function() {
        return React.DOM.div({}, "Allo");
    }
});
