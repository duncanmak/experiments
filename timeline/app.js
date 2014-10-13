var DOM = React.DOM;

var Timeline = React.createClass({

	getInitialState: function () {
		return { data: null };
	},

	getDefaultProps: function() {
		return { selection: _.constant(true) };
	},

	hostNames: function(hosts) {
		return _.keys(hosts);
	},

	buildTimes: function(hosts) {
		var timesForHost = function (host) {
			return host.map(_.property('date'));
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
			return _.any([k, v], _.isEmpty) || this.props.selection(k); 
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

	renderHostsAsSVG: function(hosts, barHeight) {
		var data       = this.state.data;
		var hostNames  = this.hostNames(hosts);
		var buildTimes = this.buildTimes(hosts);
		var xScale     = d3.scale.ordinal().domain(hostNames);
		var yScale     = d3.time.scale().domain(buildTimes);

		return hostNames.map(function (host) {
			return data[host].map(function (entry) {
				var width  = yScale.rangeRound([new Date(entry.date)]);
				var height = xScale(host);
				var x      = barHeight - height;
				var y      = yScale(host);
				return DOM.rect({width: width, height: height, x: x, y: y});

			});	
		});
	},

	renderAsSVG: function (hosts) {
		var barHeight = 20;
		return DOM.svg(
			{ width: "100%", height: 1000 }, 
			this.renderHostsAsSVG(hosts, barHeight));
	},

	render: function() {
		var hosts = this.state.data;
		return this.renderAsSVG(hosts);
	},
});
