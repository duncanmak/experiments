/*global console, require */
'use strict';

var _          = require('lodash');
var browserify = require('browserify');
var colors     = require('colors');
var concatCss  = require('gulp-concat-css');
var del        = require('del');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var gutil      = require('gulp-util');
var lrload     = require('livereactload');
var my         = require('./sources');
var nodemon    = require('gulp-nodemon');
var path       = require('path');
var source     = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts         = require('gulp-typescript');
var watchify   = require('watchify');

var watching = false;

var bundler = browserify({
    entries:      my.jsSources,
    paths:        ['src'],
    transform:    gutil.env.type === 'production' ? [] : [lrload], // For production this needs to be false
    debug:        true,
    cache:        {},
    packageCache: {},
    fullPaths:    true
});

var tsProject = ts.createProject({
    noExternalResolve: true,
    module: 'commonjs',
    sortOutput: true
});

// TASKS
//==============================================================================

gulp.task('copyHtml', function() {
    gulp.src(my.htmlSources).pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
    return gulp.src(my.tsSources)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'));
});

gulp.task('css', function () {
  var stream = gulp.src(my.cssSources)
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./dist'));

    return stream;
});

gulp.task('bundle', ['vendor','build'], _.partial(bundle, 'app.js', bundler, true));

gulp.task('vendor', _.partial(bundle, 'vendor.js', browserify(), false));

gulp.task('watch', ['deploy', 'serve'], function() {
    watching = true;

    gulp.watch(my.tsSources,   ['build']);
    gulp.watch(my.htmlSources, ['copyHtml']);
    gulp.watch(my.cssSources,  ['css']);
    lrload.listen();

    watchify(bundler)
        .on('error', gutil.log)
        .on('update', _.partial(bundle, 'app.js', bundler, true));
});

gulp.task('serve', function() {
    nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'dist/app.js', 'dist/vendor.js','js/*', 'node_modules/*'] })
        .on('restart', function () { gutil.log('Server restarted'); });
});

gulp.task('clean', function() { del(['js', 'dist']); });

gulp.task('deploy', ['copyHtml', 'css', 'bundle']);

gulp.task('default', ['watch']);

function bundle(output, b, isExternal) {
    console.log('Bundling', output);

    my.libs.forEach(function(lib) {
        if (isExternal) {
            b.external(lib);
        } else {
            b.require(lib);
        }
    });
    b.bundle()
        .on('error', function(err) { gutil.log(err.message.bgRed); })
        .pipe(source(output))
        .pipe(gulp.dest('dist'))
        .pipe(gulpif(watching, lrload.gulpnotify()));
}
