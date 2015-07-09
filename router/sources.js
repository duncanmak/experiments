/*global module, require */

var _    = require('lodash');
var path = require('path');

var libs = [
    'jquery',
    'lodash',
    'react'
];

var sources = relativeToRoot(
    'src/app.ts',
    'src/foo.ts',
    'src/bar.ts',
    'src/main.ts',
    'src/routes.ts'
);

var typings = relativeToRoot(
    'typings/jquery/jquery.d.ts',
    'typings/lodash/lodash.d.ts',
    'typings/react/react.d.ts',
    'typings/react/react-global.d.ts',
    'typings/react-router/react-router.d.ts'
);

var htmlSources = [
    'index.html'
];

var jsSources = sources.map(ts2js).concat(relativeToRoot(
));

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
