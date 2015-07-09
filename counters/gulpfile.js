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
var nodemon    = require('gulp-nodemon');
var path       = require('path');
var source     = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts         = require('gulp-typescript');
var tsd        = require('gulp-tsd');
var watchify   = require('watchify');

var project    = require('./tsconfig.json');

var watching = false;

var tsSources = project.files.slice(0, -1);
var jsSources = relativeToRoot(tsSources.map(ts2js));
console.log('jsSources', jsSources);

var bundler = browserify({
    entries:      jsSources,
    transform:    gutil.env.type === 'production' ? [] : [lrload], // For production this needs to be false
    debug:        true,
    cache:        {},
    packageCache: {},
    fullPaths:    true
});

var tsProject = ts.createProject('tsconfig.json');

gulp.task('fetchTypings', function (cb) {
    tsd({ command: 'reinstall', config: './tsd.json' }, cb);
});

gulp.task('copyHtml', function() {
    gulp.src(project.html).pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'));
});

gulp.task('css', function () {
  var stream = gulp.src(project.css)
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./dist'));

    return stream;
});

gulp.task('bundle', ['vendor', 'build'], _.partial(bundle, 'app.js', bundler, true));

gulp.task('vendor', _.partial(bundle, 'vendor.js', browserify(), false));

gulp.task('watch', ['deploy', 'serve'], function() {
    watching = true;

    gulp.watch(project.files,   ['build']);
    gulp.watch(project.html,    ['copyHtml']);
    gulp.watch(project.css,     ['css']);
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

    project.libraries.forEach(function(lib) {
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

function ts2js (f) {
    return 'js/' + f.replace('.ts', '.js');
}

function relativeToRoot (files) {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(files, _.compose(path.resolve, splitPath));
}
