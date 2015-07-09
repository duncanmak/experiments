/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />

module BarChart2 {

    var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

    var width = 600 * 2,
        height = 250,
        maxValue = 100;

    var xScale = d3.scale.ordinal()
        .domain(d3.range(dataset.length))
        .rangeRoundBands([0, width], 0.05);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, height]);

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var rects = svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr({
            x: (d, i) => xScale(i),
            y: d => height - yScale(d),
            width: xScale.rangeBand(),
            height: d => yScale(d),
            fill: d => "rgb(0, 0, " + (d * 10) + ')'
        });

    var labels = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d => d)
        .attr({
            x: (d, i) => xScale(i) + xScale.rangeBand() / 2,
            y: d => height - yScale(d) + 14,
            "font-family": "sans-serif",
            "font-size": "11px",
            "text-anchor": "middle",
            fill: "white"
        });

    d3.select('p')
        .on('click', () => {

            dataset = _.range(dataset.length).map(i => _.random(maxValue));
            yScale.domain([0, d3.max(dataset)]);

            svg.selectAll('rect')
                .data(dataset)
                .transition()
                .delay((d, i) => i * 100)
                .duration(500)
                .attr('y', d => height - yScale(d))
                .attr('height', d => yScale(d))
                .attr('fill', d => "rgb(0, 0, " + (d * 10) + ')');


            svg.selectAll('text')
                .data(dataset)
                .transition()
                .delay((d, i) => i * 100)
                .duration(500)
                .text(d => d)
                .attr({
                    x: (d, i) => xScale(i) + xScale.rangeBand() / 2,
                    y: d => height - yScale(d) + 14
                })
        });
}
