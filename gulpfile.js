var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    path = require('path'),
    pump = require('pump'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del');



var paths = {
    sass: ['src/scss/*.scss'],
    scripts: ['src/js/*.js'],
    dist: 'dist/**/*.*'
};

gulp.task('scripts', function(done) {
    pump([
            gulp.src(paths.scripts),
            jshint(),
            jshint.reporter('default', { verbose: true }),
            //jshint.reporter('fail'), //Fail if jshint show errors in console
            sourcemaps.init(),
            concat('jquery.wheelmenu.js'),
            sourcemaps.write(),
            gulp.dest('./dist/js/'),
            rename('jquery.wheelmenu.min.js'),
            uglify(),
            gulp.dest("./dist/js/"),
            notify({ message: 'Scripts uglify' })
        ],
        done
    );
});

gulp.task('styles', function() {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('wheelmenu.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(notify({ message: 'Styles built' }));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});

gulp.task('clean-dist', function () {
    return del(paths.dist);
});

gulp.task('default', ['clean-dist', 'scripts', 'styles']);