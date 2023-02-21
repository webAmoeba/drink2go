import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import browser from 'browser-sync';
import { deleteSync } from 'del'
import ghPages from 'gulp-gh-pages';


// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build'));
}

// Images

const optimizeImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.{jpg,png}'])
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.{jpg,png}'])
    .pipe(gulp.dest('build/img'));
}

// WebP

const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.{jpg,png}'])
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

// SVG

export const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprite/*.svg', '!source/img/favicons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/img/sprite/**/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/img/favicons/*.{png,svg}',
    'source/*.ico',
    'source/leaflet/*.css'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = (done) => {
  deleteSync('build/*/');
  done();
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/app.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
);


// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));


gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});
