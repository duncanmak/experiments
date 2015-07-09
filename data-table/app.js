/*jslint indent: 4, sloppy: true */
/*global React */

var DOM = React.DOM;

var DataTable = React.createClass({

    getInitialState: function() {
        console.log("getInitialState");
        return {
            "Xamarin.iOS": "",
            "amarin Studio": ""
        };
    },

    componentDidMount: function() {
        console.log("componentDidMount");
        $.get("/data-table/data.json", function(result) {
            if (this.isMounted()) { this.setState(result); }
        }.bind(this));
    },

    render: function() {
        console.log("render");
        return DOM.div(
            {},
            DOM.h1({}, "this is my table"),
            DOM.h2({}, this.state["Xamarin.iOS"] )
        );
    }
});
