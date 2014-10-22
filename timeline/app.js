/*global React, _, $, d3, moment */

var DOM = React.DOM;

var Bar = React.createClass({
    displayName: 'Bar',

    getDefaultProps: function() { return { isVisible: _.constant(1) }; },

    fillColor: function () {
        var state = this.props.entry.state;

        if (state === "Issues") return "orange";
        if (state === "Failed") return "red";
        return "green";
    },

    isVisible: function () {
        return this.props.isVisible(this.props.entry) ? 1 : 0;
    },

    onMouseOver: function(evt) {
        if (this.isVisible()) {
            this.props.displayEntry(this.props.entry);
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return this.props.entry.revision != nextProps.entry.revision;
    },

    render: function() {
        var x = this.props.x;
        var y = this.props.y;
        var w = this.props.width;
        var h = this.props.height;
        var c = this.fillColor();
        var o = this.isVisible();

        var left  = DOM.line({ key: 1, x1: x,     y1: y, x2: x,     y2: y + h, opacity: o, stroke: 'black', strokeWidth: 0.2 });
        var right = DOM.line({ key: 2, x1: x + w, y1: y, x2: x + w, y2: y + h, opacity: o, stroke: 'black', strokeWidth: 0.2 });

        var rect = DOM.rect({
            key:         3,
            x:           x,
            y:           y,
            width:       w,
            height:      h,
            fill:        c,
            opacity:     o,
            onMouseOver: this.onMouseOver
        });

        return DOM.g({}, (w > 3) ? [left, rect, right] : rect);
    }
});

var Lane = React.createClass({
    displayName: 'Lane',

    getInitialState: function() { return { bgOpacity: 0 }; },

    setOpacity: function(opacity, evt) { this.setState({ bgOpacity: opacity }); },

    shouldComponentUpdate: function (nextProps, nextState) {
        return this.state.bgOpacity != nextState.bgOpacity;
    },

    renderEntry: function(entry, key) {
        var a = entry.moment;
        var b = a.clone().add(entry.duration, 'seconds');
        var x = this.props.xScale(a.toDate());
        var y = this.props.yScale(this.props.host);

        return Bar({
            key:   key,
            entry: entry,
            x: x,
            y: y,
            width:        Math.max(0.5, this.props.xScale(b.toDate()) - x),
            height:       this.props.barHeight,
            host:         this.props.host,
            displayEntry: this.props.displayEntry,
            isVisible:    this.props.isVisible
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

    weekdays: function() {
        var timeScale = this.props.xScale;
    },

    render: function() {
        return DOM.g(
            { onMouseEnter: this.setOpacity.bind(this, 0.1), onMouseLeave: this.setOpacity.bind(this, 0) },
            this.textLabel(),
            this.boundingBox(),
            // this.weekdays(),
            this.separator(),
            this.props.entries.map(this.renderEntry)
        );
    }
});

var Selector = React.createClass({
    displayName: 'Selector',

    onChange: function(product, evt) {
        console.log(product, 'was toggled', evt.target.value, evt);
    },

    products: function () {
        var data  = this.props.data;
        var lanes = _.chain(data).values().flatten().pluck('lane').uniq().value();
        return _.chain(lanes).map(function (l) { return l.split("-")[0]; }).flatten().uniq().sort().value();
    },

    renderCheckbox: function(product) {
        return DOM.li(
            { key: product },
            DOM.input({
                type: 'checkbox',
                onChange: this.onChange.bind(this, product)
            }), product);

    },

    render: function () {
        return DOM.div({}, DOM.ul(
            { style: { padding: 0, listStyleType: 'none' }},
            this.products().map(this.renderCheckbox)
        ));
    }
});

var Timeline = React.createClass({
    displayName: 'Timeline',

    laneContains: function (name, entry) { return entry.lane.indexOf(name) >= 0; },

    getInitialState: function() {
        return {
            data: {},
            filter: [] // [this.laneContains.bind(this, 'maccore')]
        };
    },

    getDefaultProps: function() { return { exclude: [], keep: [] }; },

    hostNames: function(hosts) { return _.keys(hosts); },

    buildTimes: function(hosts) {
        var timesForHost = function (host) {
            return host.map(function (i) {
                return [i.moment, i.moment.clone().add(i.duration)];
            });
        };

        var times = _.chain(hosts).values().map(timesForHost).flatten().value();
        return [moment.min(times), moment.max(times)];
    },

    componentDidMount: function() {
        $.get(this.props.url, function (result) {
            var data = this.visibleHosts(result.hostHistory);
            this.setState({ data: data });
        }.bind(this));
    },

    visibleHosts: function(data) {
        var keep    = this.props.keep;
        var exclude = this.props.exclude;
        var isAncient = function (entry) { return entry.moment.year() < 2014; };

        return _.chain(data)
            .mapValues(function (i)  { return _.map(i, function(entry) { return _.merge(entry, { moment: moment(entry.date) }); }); })
            .omit(function (v, k) { return _.any([k, v], _.isEmpty); })
            .omit(function (v, k) { return _.any(v, isAncient); } )
            .omit(function (v, k) { return k.indexOf('QA') >= 0; } )
            .omit(function (v, k) { return _.contains(exclude, k); } )
            .omit(function (v, k) { return _.any(keep, function(i) { return k.indexOf(i) < 0; }); })
            .value();
    },

    isVisible: function (item) {
        var filter = this.state.filter;
        var result = _.isEmpty(filter) || _.any(filter, function (f) { return f(item); });
        return result;
    },

    renderHosts: function(svgHeight, svgWidth, barHeight) {
        var data = this.state.data;

        if (_.isEmpty(data))
            return undefined;

        var buildTimes      = this.buildTimes(data);
        var hostNames       = this.hostNames(data);
        var isVisible       = this.isVisible;
        var setCurrentEntry = this.setCurrentEntry;
        var start           = _.head(buildTimes);
        var end             = _.last(buildTimes);

        var rightPadding    = 120;
        var xScale          = d3.time.scale().domain([start.toDate(), end.toDate()]).nice(d3.time.week).rangeRound([0, svgWidth - rightPadding]);
        var yScale          = d3.scale.ordinal().domain(hostNames).rangeBands([0, svgHeight]);

        return hostNames.map(function (host, key) {
            return Lane({
                key          : key,
                host         : host,
                entries      : data[host],
                xScale       : xScale, yScale: yScale,
                svgHeight    : svgHeight, svgWidth: svgWidth,
                barHeight    : barHeight,
                rightPadding : rightPadding,
                isVisible    : isVisible,
                displayEntry : setCurrentEntry
            });
        });
    },

    onMouseLeave: function(evt) { this.setState({ current: undefined }); },

    setCurrentEntry: function(entry)  { this.setState({current: entry}); },
    setFilter:       function(filter) { this.setState({filter: filter}); },

    renderCurrent: function() {
        if (!_.isUndefined(this.state.current))
            return DOM.div(
                {},
                DOM.p({}, "Started: " + this.state.current.moment.format('MMM D, YYYY [at] hh:mm:ss a')),
                DOM.p({}, "Duration: " + moment.duration(this.state.current.duration, 'seconds').humanize()),
                DOM.p({}, this.state.current.lane),
                DOM.code({}, this.state.current.revision)
            );

        return undefined;
    },

    render: function () {
        var svgHeight = this.props.height;
        var svgWidth  = this.props.width;
        var barHeight = Math.min(this.props.minHeight, (svgHeight - 200) / this.hostNames(this.state.data).length);
        return DOM.div(
            {},
            DOM.svg(
                { style: { 'float': 'right', marginRight: '150px' }, height: svgHeight, width: svgWidth, onMouseLeave: this.onMouseLeave },
                this.renderHosts(svgHeight, svgWidth, barHeight)
            ),
            Selector({ data: this.state.data, setFilter: this.setFilter }),
            DOM.div({}, this.renderCurrent())
        );
    }
});
