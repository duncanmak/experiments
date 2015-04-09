'use strict';

var _          = require('underscore');
var browserify = require('browserify');
var buffer     = require('vinyl-buffer');
var colors     = require('colors');
var del        = require('del');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var lrload     = require('livereactload');
var nodemon    = require('gulp-nodemon');
var path       = require('path');
var source     = require('vinyl-source-stream');
var tsify      = require('tsify');
var watchify   = require('watchify');

var htmlSources = [
    'index.html'
];

var typescriptSources = relativeToRoot(
    'src/main.ts',
    'src/hello.ts'
);

var typings = relativeToRoot(
    'typings/react/react.d.ts',
    'typings/underscore/underscore.d.ts'
);

var bundler = browserify({
    entries: typescriptSources.concat(typings),
    debug: true,
    transform: [lrload],
    cache:        {},
    packageCache: {},
    fullPaths: true
});

gulp.task('build', build);

gulp.task('watch', function() {

    gulp.watch(htmlSources, ['copyIndexHtml']);
    lrload.listen();

    return watchify(build())
        .on('error', gutil.log)
        .on('update', build);
});

gulp.task('copyIndexHtml', function() {
    gulp.src(htmlSources).pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watch'], function() {
    nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'dist/bundle.js', 'node_modules/*'] })
        .on('change', [])
        .on('restart', function () { gutil.log('Server restarted'); });
});

gulp.task('default', ['browserify', 'copyIndexHtml']);

gulp.task('clean', function() { del(['dist']); });

function relativeToRoot () {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(arguments, _.compose(path.resolve, splitPath));
}

function build () {
    gutil.log('Rebuilding bundle');

    var bundler = browserify({
        entries: typescriptSources.concat(typings),
        debug: true,
        transform: [lrload],
        cache:        {},
        packageCache: {},
        fullPaths: true
    });

    return bundler
        .plugin('tsify')
        .bundle()
        .on('error', function(err) { console.log (err.message.bgRed); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
        .pipe(lrload.gulpnotify());
}
