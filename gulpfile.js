var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
  return gulp.src('build/*', {
    read: false
  }).pipe(clean());
});

gulp.task('move', ['clean'], function() {
  gulp.src(['src/ui/*/*.*', 'popup.html', 'manifest.json', 'src/contentscript/*.*'])
  .pipe(gulp.dest('build'));
});

gulp.task('build-background',  function () {
  return doBrowserify('./src/background/background.js');
});

gulp.task('build-popup',  function () {
  return doBrowserify('./src/js/popup.js');
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build', function (callback) {
  runSequence(
    'move',
    'build-popup',
    'build-background',
    callback);
});

function doBrowserify (entry) {
  var bundle;
  bundle = bundler(entry, 'build/');

  return bundle;
}

function bundler (entry, dest) {
  var filename = entry.split('/').pop();

  return browserify({
    entries: entry,
    debug: true,
    paths: ['./node_modules', './']
  })
    .bundle()
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
}


// function doBrowserify(entry) {
//   var bundle;
//   bundle = bundler(entry, './build/');
//   var filename = entry.split('/').pop();

//   browserify({
//       entries: entry,
//       debug: true,
//       paths: ['./node_modules', './src']
//     })
//     .bundle()
//     .pipe(source(filename))
//     .pipe(buffer())
//     .pipe(sourcemaps.init({
//       loadMaps: true
//     }))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest(dest));
// }
