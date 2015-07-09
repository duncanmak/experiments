/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />
var Scatterplot2;
(function (Scatterplot2) {
    var width = 500 * 2, height = 300 * 2, padding = 30, numValues = 50, maxValue = _.random(100);

    var dataset = _.range(numValues).map(function (i) {
        return [_.random(maxValue), _.random(maxValue)];
    });

    var xScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
            return d[0];
        })]).range([padding, width - padding * 2]);

    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
            return d[1];
        })]).range([height - padding, padding]);

    var rScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
            return d[1];
        })]).range([2, 5]);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5);

    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);

    var svg = d3.select('body').append('svg').attr({ width: width, height: height });

    svg.append('clipPath').attr('id', 'chart-area').append('rect').attr({
        x: padding,
        y: padding,
        width: width - padding * 3,
        height: height - padding * 2
    });

    svg.append('g').attr('id', 'circles').attr('clip-path', 'url(#chart-area)').selectAll('circle').data(dataset).enter().append('circle').attr({
        cx: function (d) {
            return xScale(d[0]);
        },
        cy: function (d) {
            return yScale(d[1]);
        },
        r: function (d) {
            return 2;
        }
    });

    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + (height - padding) + ')').call(xAxis);

    svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + padding + ', 0)').call(yAxis);

    d3.select('p').on('click', function () {
        maxValue = _.random(100);

        dataset = _.range(numValues).map(function (i) {
            return [_.random(maxValue), _.random(maxValue)];
        });

        xScale.domain([0, d3.max(dataset, function (d) {
                return d[0];
            })]);
        yScale.domain([0, d3.max(dataset, function (d) {
                return d[1];
            })]);

        svg.selectAll('circle').data(dataset).transition().duration(1000).each('start', function () {
            d3.select(this).attr('fill', 'magenta').attr('r', 7);
        }).attr('cx', function (d) {
            return xScale(d[0]);
        }).attr('cy', function (d) {
            return yScale(d[1]);
        }).transition().duration(1000).attr('fill', 'black').attr('r', 2);

        svg.select('.x.axis').transition().duration(1000).call(xAxis);

        svg.select('.y.axis').transition().duration(1000).call(yAxis);
    });
})(Scatterplot2 || (Scatterplot2 = {}));
