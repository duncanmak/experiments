﻿/// <reference path="d3.d.ts" />
/// <reference path="underscore.d.ts" />

module Scatterplot {

    var dataset = [
        [5, 20],
        [480, 90],
        [250, 50],
        [100, 33],
        [330, 95],
        [410, 12],
        [475, 44],
        [25, 67],
        [85, 21],
        [220, 88],
    ];

    var width = 500,
        height = 100;

    var svg = d3.select('body').append('svg').attr({ width: width, height: height });

    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr({
            cx: d => d[0],
            cy: d => d[1],
            r:  d => Math.sqrt(height - d[1])
        });

    svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d => d[0] + ", " + d[1])
        .attr({ x: d => d[0], y: d => d[1] })
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'red');

}