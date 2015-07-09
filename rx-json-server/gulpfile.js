var gulp    = require('gulp');
var ts      = require('gulp-typescript');
var project = require('tsconfig.json');


var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
  return gulp.src()
    .pipe(ts(tsProject)).js
    .on('error', function(err){ console.log(err.message); })
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch(project.files, ['build']);
});

gulp.task('default', ['build']);
