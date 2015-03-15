var browserify = require('browserify');
var del        = require('del');
var gulp       = require('gulp');
var path       = require('path');
var serve      = require('gulp-serve');
var source     = require('vinyl-source-stream');
var _          = require('underscore');

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

gulp.task('browserify', function () {
    var entries = typescriptSources.concat(typings);

    browserify({ entries: entries, debug: true })
        .plugin('tsify')
        .bundle()
        .on('error', function(err) { console.log (err.message); this.end(); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(typescriptSources, ['browserify']);
    gulp.watch(htmlSources,       ['copyIndexHtml']);
});

gulp.task('copyIndexHtml', function() {
    gulp.src(htmlSources).pipe(gulp.dest('dist'));
});

gulp.task('serve', ['default', 'watch'], serve('dist'));

gulp.task('default', ['browserify', 'copyIndexHtml']);

gulp.task('clean', function() { del(['dist']); });

function relativeToRoot () {
    var splitPath = function(p) { return path.join.apply(undefined, p.split('/')); };
    return _.map(arguments, _.compose(path.resolve, splitPath));
};
