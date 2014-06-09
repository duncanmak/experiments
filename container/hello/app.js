/*jslint indent: 4, sloppy: true */
/*global React */

var DOM = React.DOM,
    _   = require("underscore");

module.exports = React.createClass({
    statics: {
        label: 'Hello'
    },

    render: function() {
        return DOM.div({},
            DOM.h1({}, "Bonjour"),
            DOM.h2({}, JSON.stringify(_.filter([1,2,3,4,5], function (i) { return i % 2 == 0; })))
           );
    }
});
