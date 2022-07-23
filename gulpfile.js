const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const changed = require('gulp-changed');
const webp = require('gulp-webp');
const browserSync = require('browser-sync').create();

// HTML
const htmlTask = () => {
  return src('app/*.html')
    .pipe(dest('dist'))
}

// SASS
const scssTask = () => {
  return src('app/scss/main.scss', {sourcemaps: true})
    .pipe(sass())
    .pipe(concat('main.min.css'))
    .pipe(postcss([cssnano]))
    .pipe(dest('dist/styles', {sourcemaps: '.'}));
}

// JS
const jsTask = () => {
  return src('app/js/*.js', {sourcemap: true})
    .pipe(concat('script.min.js'))
    .pipe(terser())
    .pipe(dest('dist/js', {sourcemaps: '.'}));
}

// IMAGES
const imagesTask = () => {
  return src('app/images/*.*')
    .pipe(changed('dist/images'))
    .pipe(dest('dist/images'))
    .pipe(webp())
    .pipe(dest('app/images'))
    .pipe(dest('dist/images'))
}

// FONTS
const fontsTask = () => {
  return src('app/fonts/*.*')
    .pipe(dest('dist/fonts'))
}

// BROWSER SERVE
const browserServe = (callback) => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  callback();
}

// BROWSER RELOAD
const browserReload = (callback) => {
  browserSync.reload();
  callback();
}

// WATCH
const watchTask = () => {
  watch('app/*.html', series(htmlTask, browserReload));
  watch('app/images', series(imagesTask, browserReload));
  watch('app/fonts', series(fontsTask, browserReload));
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'],series(scssTask, jsTask, browserReload));
}

// Default TASK
exports.default = series(
  htmlTask,
  imagesTask,
  fontsTask,
  scssTask,
  jsTask,
  browserServe,
  watchTask
)
