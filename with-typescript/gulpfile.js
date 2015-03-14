var browserify = require('browserify');
var del        = require('del');
var gulp       = require('gulp');
var serve      = require('gulp-serve');
var source     = require('vinyl-source-stream');
var ts         = require('gulp-typescript');

var htmlSources = [
    'index.html'
];

var typescriptSources = [
    './src/main.ts'
];

var jsSources = typescriptSources.map(function (i) {
    return i
        .replace('src/', 'js/')
        .replace('.ts', '.js');
});

var typings = [
    './typings/react/react.d.ts',
    './typings/underscore/underscore.d.ts'
];

var tsProject = ts.createProject({
    noImplicitAny: true,
    module: 'commonjs'
});

gulp.task('build', function() {
    return gulp.src(typescriptSources.concat(typings))
        .pipe(ts(tsProject)).js
        .pipe(gulp.dest('js'));
});

gulp.task('browserify', function () {
    browserify({ entries: jsSources, paths: ['./js'] })
	.bundle()
	.on('error', function(err){ console.log (err.message); this.end(); })
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(typescriptSources, ['build']);
    gulp.watch(jsSources,         ['browserify']);
    gulp.watch(htmlSources,       ['copyIndexHtml']);
});

gulp.task('copyIndexHtml', function() {
    gulp.src('index.html').pipe(gulp.dest('dist'));
});

gulp.task('serve', ['default', 'watch'], serve('dist'));

gulp.task('default', ['build', 'browserify', 'copyIndexHtml']);

gulp.task('clean', function() {
    del(jsSources.concat(['dist']));
});
