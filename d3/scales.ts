/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />

module Scatterplot {

    //var dataset = [
    //    [5, 20],
    //    [480, 90],
    //    [250, 50],
    //    [100, 33],
    //    [330, 95],
    //    [410, 12],
    //    [475, 44],
    //    [25, 67],
    //    [85, 21],
    //    [220, 88],
    //    [660, 150]
    //];

    var dataset = _.range(50).map(i => [_.random(100), _.random(100)]);

    var width = 500, height = 300, padding = 30

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, d => d[0])])
        .range([padding, width - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([height - padding, padding]);

    var rScale = d3.scale.linear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([2, 5]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5);

    var svg = d3.select('body').append('svg').attr({ width: width, height: height });

    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr({
            cx: d => xScale(d[0]),
            cy: d => yScale(d[1]),
            r:  d => rScale(d[1])
        });

    //svg.selectAll('text')
    //    .data(dataset)
    //    .enter()
    //    .append('text')
    //    .text(d => d[0] + ", " + d[1])
    //    .attr({ x: d => xScale(d[0]), y: d => yScale(d[1]) })
    //    .attr('font-family', 'sans-serif')
    //    .attr('font-size', '11px')
    //    .attr('fill', 'red');

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);
}