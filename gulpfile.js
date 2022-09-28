const { src, dest, parallel, series, watch } = require('gulp')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const del = require('gulp-clean')

function browsersync() {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true,
    })
}

function scripts() {
    return src('app/js/app.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/sass/main.sass')
        .pipe(sass())
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/images/src/*')
        .pipe(newer('app/images/dest/'))
        .pipe(imagemin())
        .pipe(dest('app/images/dest/'))
}

function startWatch() {
    watch('app/sass/*.sass', styles)
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts)
    watch('**/*.html').on('change', browserSync.reload)
    watch('app/images/src/**/*', images)
}

function cleanimg() {
    return src('app/images/dest/**/*').pipe(del({ force: true }))
}

function cleandist() {
    return src('dist/**/*').pipe(del({ force: true }))
}

function buildcopy() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/images/dest/**/*',
        'app/**/*.html',
    ], { base: 'app' }).pipe(dest('dist'))
}


function iconsbuild () {
    return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(dest('app/font/webfonts'));
}

exports.browsersync = browsersync
exports.scripts = scripts
exports.styles = styles
exports.images = images
exports.cleanimg = cleanimg
exports.cleandist = cleandist
exports.iconsbuild = iconsbuild

exports.build = series(cleandist, styles, scripts, images, buildcopy)
exports.default = parallel(styles, scripts, browsersync, startWatch)
