/*global require */
'use strict';

var _          = require('lodash');
var browserify = require('browserify');
var colors     = require('colors');
var del        = require('del');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var lrload     = require('livereactload');
var nodemon    = require('gulp-nodemon');
var path       = require('path');
var source     = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts         = require('gulp-typescript');
var watchify   = require('watchify');

var sources = relativeToRoot(
    'src/main.ts',
    'src/app.ts'
);

var typings = relativeToRoot(
    'typings/react/react.d.ts'
);

var htmlSources = [
    'index.html'
];

var jsSources = sources.map(ts2js);

var tsProject = ts.createProject({
    noExternalResolve: true,
    module: 'commonjs',
    sortOutput: true
});

gulp.task('copyHtml', function() {
    gulp.src(htmlSources).pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
    return gulp.src(sources.concat(typings))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'));
});

var watcher = watchify(browserify({
    entries:      jsSources,
    transform:    lrload,
    debug:        true,
    cache:        {},
    packageCache: {},
    fullPaths:    true
}));

gulp.task('bundle', bundle);

gulp.task('watch', ['copyHtml', 'build', 'bundle', 'serve'], function() {
    gulp.watch(sources,     ['build']);
    gulp.watch(htmlSources, ['copyHtml']);
    lrload.listen();
    return watcher
        .on('error', gutil.log)
        .on('update', bundle);
});

gulp.task('serve', function() {
    nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'dist/bundle.js', 'js/*', 'node_modules/*'] })
        .on('restart', function () { gutil.log('Server restarted'); });
});

gulp.task('clean', function() { del(['js', 'dist']); });

gulp.task('default', ['watch']);

function relativeToRoot () {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(arguments, _.compose(path.resolve, splitPath));
}

function ts2js (f) {
    return f
        .replace('src/', 'js/')
        .replace('.ts', '.js');
}

function bundle() {
    watcher
        .bundle()
        .on('error', function(err) { gutil.log(err.message.bgRed); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'))
        .pipe(lrload.gulpnotify());
}
