/*global module, require */

var _    = require('lodash');
var path = require('path');

var libs = [
    'react',
    'react-router'
];

var sources = relativeToRoot(
    'src/test.ts'
);

var typings = relativeToRoot(
    'typings/react/react.d.ts',
    'typings/react-router/react-router.d.ts'
);

var htmlSources = [
    'index.html'
];

var jsSources = sources.map(ts2js);

var cssSources = [
];

module.exports = {
    cssSources: cssSources,
    htmlSources: htmlSources,
    jsSources: jsSources,
    libs: libs,
    tsSources: sources.concat(typings)
};

function relativeToRoot () {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(arguments, _.compose(path.resolve, splitPath));
}

function ts2js (f) {
    return f
        .replace('src/', 'js/')
        .replace('.ts', '.js');
}
