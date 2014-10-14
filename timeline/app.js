/*global React, _, $, d3, moment */

var DOM = React.DOM;

var Timeline = React.createClass({

    getInitialState: function () {
	return { data: {} };
    },

    getDefaultProps: function() {
	return { selection: [] };
    },

    hostNames: function(hosts) {
	return _.keys(hosts);
    },

    buildTimes: function(hosts) {
	var timesForHost = function (host) {
	    return host.map(function (i) {
                return { date: moment(i.date), duration: i.duration };
            });
	};

	return _.flatten(_.values(hosts).map(timesForHost));
    },

    componentDidMount: function() {
	$.get(this.props.url, function (result) {
	    this.setState({ data: this.visibleHosts(result.hostHistory) });
	}.bind(this));
    },

    visibleHosts: function(data) {
	return _.omit(data, function (v, k) {
            if (_.isEmpty(this.props.selection))
	        return _.any([k, v], _.isEmpty);
            else
                return k.indexOf(this.props.selection) < 0;
	}.bind(this));
    },

    renderHostsAsList: function(hosts) {
	return this.hostNames(hosts).map(function (k, idx) {
	    return DOM.li({key: idx}, k + " " + this.state.data[k].length);
	}.bind(this));
    },

    renderAsList: function (hosts) {
	return DOM.ul({}, this.renderHostsAsList(hosts));
    },

    renderHostsAsSVG: function(hosts, svgHeight, svgWidth, barHeight) {
	var data       = this.state.data;
        if (_.isEmpty(data))
            return undefined;

        var hostNames  = this.hostNames(hosts);
	var buildTimes = this.buildTimes(hosts);
        var start      = _.last(buildTimes).date;
        var end        = _.head(buildTimes).date;
	var xScale     = d3.scale.ordinal().domain(hostNames).rangeBands([0, svgHeight]);
	var yScale     = d3.time.scale().domain([start.toDate(), end.toDate()]).range([0, svgWidth]);

	return hostNames.map(function (host) {
	    return data[host].map(function (entry) {
                var a = moment(entry.date);
                var b = moment(entry.date).add(entry.duration, 'seconds');

                var x      = xScale(host);
		var y      = yScale(a.toDate());
		var width  = yScale(b.toDate()) - yScale(a.toDate());
		var height = barHeight;

                console.log({x: x, y: y, width: width, height: height});
		return DOM.rect({width: width, height: height, x: x, y: y});

	    });
	});
    },

    renderAsSVG: function (hosts) {
        var svgHeight = 1000;
        var svgWidth  = 1000;
	var barHeight = 20;
	return DOM.svg(
	    { height: svgHeight, width: svgWidth },
	    this.renderHostsAsSVG(hosts, svgHeight, svgWidth, barHeight));
    },

    render: function() {
	var hosts = this.state.data;
	return this.renderAsSVG(hosts);
    }
});



