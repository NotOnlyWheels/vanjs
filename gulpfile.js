var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browserSync', function () {
    browserSync.init({
        files: ['./*'],
        server: {
            baseDir: './'
        },
        port: 2333
    });
});

gulp.task('default', ['browserSync']);