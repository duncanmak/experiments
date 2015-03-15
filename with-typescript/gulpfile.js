var browserify = require('browserify');
var del        = require('del');
var gulp       = require('gulp');
var serve      = require('gulp-serve');
var source     = require('vinyl-source-stream');

var htmlSources = [
    './index.html'
];

var typescriptSources = [
    './src/hello.ts',
    './src/main.ts'
];

var typings = [
    './typings/react/react.d.ts',
    './typings/underscore/underscore.d.ts'
];

gulp.task('browserify', function () {
    browserify({ entries: typescriptSources.concat(typings), path: ['./src'], debug: true })
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
