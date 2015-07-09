/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />
var BarChart2;
(function (BarChart2) {
    var dataset = [
        5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

    var width = 600 * 2, height = 250, maxValue = 100;

    var xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, width], 0.05);

    var yScale = d3.scale.linear().domain([0, d3.max(dataset)]).range([0, height]);

    var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

    var rects = svg.selectAll('rect').data(dataset).enter().append('rect').attr({
        x: function (d, i) {
            return xScale(i);
        },
        y: function (d) {
            return height - yScale(d);
        },
        width: xScale.rangeBand(),
        height: function (d) {
            return yScale(d);
        },
        fill: function (d) {
            return "rgb(0, " + (d * 10) + ', 0)';
        }
    });

    var labels = svg.selectAll('text').data(dataset).enter().append('text').text(function (d) {
        return d;
    }).attr({
        x: function (d, i) {
            return xScale(i) + xScale.rangeBand() / 2;
        },
        y: function (d) {
            return height - yScale(d) + 14;
        },
        "font-family": "sans-serif",
        "font-size": "11px",
        "text-anchor": "middle",
        fill: "white"
    });

    d3.select('p').on('click', function () {
        dataset = _.range(dataset.length).map(function (i) {
            return _.random(maxValue);
        });
        yScale.domain([0, d3.max(dataset)]);

        svg.selectAll('rect').data(dataset).transition().delay(function (d, i) {
            return i * 100;
        }).duration(500).attr('y', function (d) {
            return height - yScale(d);
        }).attr('height', function (d) {
            return yScale(d);
        }).attr('fill', function (d) {
            return "rgb(0, " + (d * 100) + ', 0)';
        });

        svg.selectAll('text').data(dataset).transition().delay(function (d, i) {
            return i * 100;
        }).duration(250).text(function (d) {
            return d;
        }).attr({
            x: function (d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            },
            y: function (d) {
                return height - yScale(d) + 14;
            }
        });
    });
})(BarChart2 || (BarChart2 = {}));
