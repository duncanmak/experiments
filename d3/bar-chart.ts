/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />

// var dataset = [5, 10, 15, 20, 25];
module BarChart {
    var dataset = _.range(20).map(i => _.random(30));

    //d3.select('body').selectAll('div')
    //    .data(dataset)
    //    .enter()
    //    .append('div')
    //    .attr('class', 'bar')
    //    .style('height', d => (d * 5) + 'px');

    var width = 500,
        height = 150,
        padding = 1;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    //var circles = svg.selectAll('circle')
    //    .data(dataset)
    //    .enter()
    //    .append('circle')
    //    .attr('cx', (d, i) => (i * 50) + 25)
    //    .attr('cy', height / 2)
    //    .attr('r', r => r)
    //    .attr('fill', 'yellow')
    //    .attr('stroke', 'orange')
    //    .attr('stroke-width', d => d / 2);

    var rects = svg.selectAll('rects')
        .data(dataset)
        .enter()
        .append('rect')
        .attr({
            x: (d, i) => i * (width / dataset.length),
            y: d => height - (d * 4),
            width: (width / dataset.length) - padding,
            height: d => d * 4,
            fill: d => "rgb(0, 0, " + (d * 10) + ')'
        });

    var labels = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d => d)
        .attr({
            x: (d, i) => i * (width / dataset.length) + (width / dataset.length - padding) / 2,
            y: d => height - (d * 4) + 14,
            "font-family": "sans-serif",
            "font-size": "11px",
            "text-anchor": "middle",
            fill: "white"
        });
}