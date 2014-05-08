/*jslint indent: 4, sloppy: true */
/*global React */

var setIntervalMixin = {
    componentWillMount: function () {
        this.intervals = [];
    },

    setInterval: function () {
        this.intervals.push(setInterval.apply(null, arguments));
    },

    componentWillUnmount: function () {
        this.intervals.map(clearInterval);
    }
};

var Counter = React.createClass({
    mixins: [setIntervalMixin],
    getInitialState: function() { return {value: 0}; },

    tick: function () {
        this.setState({value: this.state.value + 1});
    },

    statics: {
        label: "Counter"
    },

    componentDidMount: function () { this.setInterval(this.tick, 1000); },

    render: function() {
        return React.DOM.div(
            {children: React.DOM.h1(
                {children: "Hello World, " + this.state.value })});
    }
});

