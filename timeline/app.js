/*global React, _, $, d3, moment */

var DOM = React.DOM;

var Bar = React.createClass({

    getDefaultProps: function() { return { isVisible: _.constant(1) }; },

    fillColor: function () {
        var state = this.props.entry.state;

        if (state === "Issues") return "orange";
        if (state === "Failed") return "red";
        return "green";
    },

    isVisible: function () { return this.props.isVisible(this.props.entry); },

    onMouseOver: function(evt) { this.props.displayEntry(this.props.entry); },

    shouldComponentUpdate: function (nextProps, nextState) { return false; },

    render: function() {
        var a = moment(this.props.entry.date);
        var b = moment(this.props.entry.date).add(this.props.entry.duration, 'seconds');
        var x = this.props.xScale(a.toDate());
        var y = this.props.yScale(this.props.host);
        var w = this.props.xScale(b.toDate()) - x;
        var h = this.props.barHeight;

        var left  = DOM.line({ key: 1, x1: x,     y1: y, x2: x,     y2: y + h, stroke: 'black', strokeWidth: 0.2 });
        var right = DOM.line({ key: 2, x1: x + w, y1: y, x2: x + w, y2: y + h, stroke: 'black', strokeWidth: 0.2 });

        var rect = DOM.rect({
            key:         3,
            x:           x,
            y:           y,
            width:       w,
            height:      h,
            fill:        this.fillColor(),
            opacity:     this.isVisible(),
            onMouseOver: this.onMouseOver
        });

        return DOM.g({}, (w > 3) ? [left, rect, right] : rect);
    }
});

var Lane = React.createClass({

    getInitialState: function() { return { bgOpacity: 0 }; },

    setOpacity: function(opacity, evt) { this.setState({ bgOpacity: opacity }); },

    renderEntry: function(entry, key) {
        return Bar({
            key: key,
            entry: entry,
            host:         this.props.host,
            xScale:       this.props.xScale, yScale: this.props.yScale,
            svgHeight:    this.props.svgHeight, svgWidth: this.props.svgWidth - this.props.rightPadding, barHeight: this.props.barHeight,
            displayEntry: this.props.displayEntry
        });
    },

    textLabel: function() {
        return DOM.text({
            x: this.props.svgWidth - this.props.rightPadding + 30,
            y: this.props.yScale(this.props.host) + (this.props.barHeight - 6),
            fontSize: "10px",
            fontFamily: "sans-serif"
        }, this.props.host);
    },

    boundingBox: function() {
        var w = this.props.svgWidth;
        var h = this.props.barHeight;
        var x = 0;
        var y = this.props.yScale(this.props.host);

        return DOM.rect({ x: x, y: y, width: w, height: h, fill: "gray", fillOpacity: this.state.bgOpacity });
    },

    separator: function() {
        var w = this.props.svgWidth;
        var y = this.props.yScale(this.props.host) + this.props.barHeight;

        return DOM.line({ x1: 0, y1: y, x2: w, y2: y, stroke: 'gray', strokeWidth: 0.05 });
    },


    render: function() {
        return DOM.g(
            { onMouseEnter: this.setOpacity.bind(this, 0.1), onMouseLeave: this.setOpacity.bind(this, 0) },
            this.textLabel(),
            this.boundingBox(),
            this.separator(),
            this.props.entries.map(this.renderEntry)
        );
    }
});

var Timeline = React.createClass({

    getInitialState: function() { return { data: {} }; },

    getDefaultProps: function() { return { exclude: [], keep: [] }; },

    hostNames: function(hosts) { return _.keys(hosts); },

    buildTimes: function(hosts) {
        var timesForHost = function (host) {
            return host.map(function (i) {
                return [moment(i.date), moment(i.date).add(i.duration)];
            });
        };

        var times = _.chain(hosts).values().map(timesForHost).flatten().value();
        return [moment.min(times), moment.max(times)];
    },

    componentDidMount: function() {
        $.get(this.props.url, function (result) {
            this.setState({ data: this.visibleHosts(result.hostHistory) });
        }.bind(this));
    },

    visibleHosts: function(data) {
        var keep    = this.props.keep;
        var exclude = this.props.exclude;
        var isAncient = function (entry) { return moment(entry.date).year() < 2014; };

        var hosts = _.chain(data)
                .omit(function (v, k) { return _.any([k, v], _.isEmpty); })
                .omit(function (v, k) { return _.any(v, isAncient); } )
                .omit(function (v, k) { return k.indexOf('QA') >= 0; } )
                .omit(function (v, k) { return _.contains(exclude, k); } )
                .omit(function (v, k) { return _.any(keep, function(i) { return k.indexOf(i) < 0; }); })
                .value();
        return hosts;
    },

    renderHosts: function(hosts, svgHeight, svgWidth, barHeight) {
        if (_.isEmpty(hosts))
            return undefined;

        var buildTimes      = this.buildTimes(hosts);
        var hostNames       = this.hostNames(hosts);
        var setCurrentEntry = this.setCurrentEntry;
        var start           = _.head(buildTimes);
        var end             = _.last(buildTimes);

        var rightPadding    = 120;
        var xScale          = d3.time.scale().domain([start.toDate(), end.toDate()]).rangeRound([0, svgWidth - rightPadding]);
        var yScale          = d3.scale.ordinal().domain(hostNames).rangeBands([0, svgHeight]);

        return hostNames.map(function (host, key) {
            return Lane({
                key: key,
                host: host,
                entries: hosts[host],
                xScale: xScale, yScale: yScale,
                svgHeight: svgHeight, svgWidth: svgWidth,
                barHeight: barHeight,
                rightPadding: rightPadding,
                displayEntry: setCurrentEntry
            });
        });
    },

    onMouseLeave: function(evt) { this.setState({ current: undefined }); },

    setCurrentEntry: function(entry) { this.setState({current: entry}); },

    renderCurrent: function() {
        if (!_.isUndefined(this.state.current))
            return DOM.div(
                {},
                DOM.p({}, "Started: " + moment(this.state.current.date).format('MMM D, YYYY [at] hh:mm:ss a')),
                DOM.p({}, "Duration: " + moment.duration(this.state.current.duration, 'seconds').humanize()),
                DOM.p({}, this.state.current.lane),
                DOM.code({}, this.state.current.revision)
            );

        return undefined;
    },

    render: function () {
        var hosts     = this.state.data;
        var svgHeight = this.props.height;
        var svgWidth  = this.props.width;
        var barHeight = Math.min(this.props.minHeight, (svgHeight - 200) / this.hostNames(hosts).length);
        return DOM.div(
            {},
            DOM.svg(
                { height: svgHeight, width: svgWidth, onMouseLeave: this.onMouseLeave },
                this.renderHosts(hosts, svgHeight, svgWidth, barHeight)
            ),
            DOM.p({}, this.renderCurrent())
        );
    }
});
