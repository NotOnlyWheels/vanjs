var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browserSync', function () {
    browserSync.init({
        files: ['./unit_test/test/*.js', './unit_test/*.html', './src/*.js'],
        server: {
            baseDir: './'
        },
        port: 2333
    });
});

gulp.task('default', ['browserSync']);