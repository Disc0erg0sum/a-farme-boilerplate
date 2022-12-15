// Description: Gulp file for the project vr.txt from FH-Potsdam
// Author: DiscoErgoSum
// License: MIT

// @toto > for deploy - make sure to clean the dist folder first
// @todo > for deploy - make sure to minify images

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const plummer = require("gulp-plumber");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");

const paths = {
  html: {
    src: "./src/**/*.html",
    dest: "./dist/",
  },
  scripts: {
    src: "./src/**/*.js",
    dest: "./dist/",
  },
};

// development server
function browseSyncDev() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
    https: true,
  });
}

// deplyment server
function browseSyncDep() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
    https: true,
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function html(done) {
  gulp
    .src(paths.html.src)
    .pipe(plummer())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());

  done();
}

function scripts(done) {
  gulp
    .src(paths.scripts.src)
    .pipe(plummer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());

  done();
}

function copy(done) {
  gulp
    .src(["./src/*", "!./src/**/*.html", "!./src/**/*.js"])
    .pipe(plummer())
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());

  done();
}

function watch_files() {
  gulp.watch("src/**/*", reload);
}

gulp.task("default", gulp.parallel(browseSyncDev, watch_files));

gulp.task("deploy", gulp.series(copy, scripts, html, browseSyncDep));
