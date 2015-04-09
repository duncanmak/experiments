/*global console, process, require */

var _          = require('lodash');
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
var sourcemaps = require('gulp-sourcemaps');
var watchify   = require('watchify');

var entries = relativeToRoot(
    'src/main.js',
    'src/app.js'
);

var htmlSources = [
    'index.html'
];

gulp.task('copyAssets', function() {
    gulp.src(htmlSources).pipe(gulp.dest('dist'));
});

var bundler = browserify({
  entries:      entries,
  transform:    [ lrload ],
  debug:        true,
  cache:        {},
  packageCache: {},
  fullPaths:    true // for watchify
});

var watcher = watchify(bundler);

gulp.task('build', ['copyAssets'], build);

gulp.task('watch', ['serve'], function() {
  lrload.listen();
  build();
  return watcher
    .on('error', gutil.log)
    .on('update', build);
});

gulp.task('serve', function() {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'dist/bundle.js', 'node_modules/*'] })
    .on('restart', function () { gutil.log('Server restarted'); });
});

gulp.task('clean', function() { del(['dist']); });

gulp.task('default', ['copyAssets', 'serve', 'watch']);

function relativeToRoot () {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(arguments, _.compose(path.resolve, splitPath));
}

function build() {
    gutil.log('Building');
    watcher
        .bundle()
        .on('error', function(err) { gutil.log(err.message.bgRed); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
        .pipe(lrload.gulpnotify());
}
