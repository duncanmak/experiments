var browserify = require('browserify');
var del        = require('del');
var gulp       = require('gulp');
var path       = require('path');
var serve      = require('gulp-serve');
var source     = require('vinyl-source-stream');

var p = function(paths) {
    var args = [].splice.call(arguments, 0);
    return path.join.apply(undefined, [process.cwd()].concat(args));
};

var htmlSources = [
    './index.html'
];

var typescriptSources = [
    p('src', 'hello.ts'),
    p('src', 'main.ts')
];

var typings = [
    p('typings', 'react', 'react.d.ts'),
    p('typings', 'underscore', 'underscore.d.ts')
];

gulp.task('browserify', function () {
    browserify({ entries: typescriptSources.concat(typings), debug: true, fullPaths: false })
        .plugin('tsify')
        .bundle()
        .on('error', function(err){ console.log (err.message); this.end(); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(typescriptSources, ['browserify']);
    gulp.watch(htmlSources,       ['copyIndexHtml']);
});

gulp.task('copyIndexHtml', function() {
    gulp.src('index.html').pipe(gulp.dest('dist'));
});

gulp.task('serve', ['default', 'watch'], serve('dist'));

gulp.task('default', ['browserify', 'copyIndexHtml']);

gulp.task('clean', function() { del(['dist']); });
