var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var imageminJpegtran = require('imagemin-jpegtran');
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var del = require("del");
var htmlmin = require('gulp-htmlmin');
// var uglify = require("gulp-uglify");
var babel = require('gulp-babel');


gulp.task("clean", function () {
  return del("build");
});


gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});


gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});


gulp.task("images", function () {
    return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imageminJpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});


gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"))
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});


gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});


gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemap.init())
    // .pipe(uglify())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
});


gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/img/**", gulp.series("copy", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
})

gulp.task("refresh", function (done) {
  server.reload();
  done();
});


gulp.task("build", gulp.series("clean", "webp", "copy", "css", "sprite", "html", "js"));
gulp.task("start", gulp.series("build", "server"));
