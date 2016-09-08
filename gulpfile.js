var os = require('os');

var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var open = require('gulp-open');

gulp.task('clean', function () {
  return gulp.src('build/*', {
    read: false
  }).pipe(clean());
});

gulp.task('move', ['clean'], function() {
  gulp.src(['src/ui/*/*.*', 'popup.html', 'src/manifest.json', 'src/contentscript/*.*'])
  .pipe(gulp.dest('build'));
});

gulp.task('build-background',  function () {
  return bundler('./src/background/background.js', 'build/');
});

gulp.task('build-popup',  function () {
  return bundler('./src/browseraction/popup.js', 'build/');
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build', function (callback) {
  runSequence(
    'move',
    'build-popup',
    'build-background',
    'refresh-extensions',
    callback);
});

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

/* Refreshes the extensions in google chrome */
gulp.task('refresh-extensions', function() {
  console.log('refreshing extensions');
  // if you're developing on a platform other than linux, you might have to fix the ternary operator below
  var browser = os.platform() === 'linux' ? 'google-chrome': (
    os.platform() === 'darwin' ? 'google chrome' : (
    os.platform() === 'win32' ? 'chrome' : 'firefox'));
  gulp.src('')
    .pipe(open({
      uri: 'http://reload.extensions',
      app: browser
    }));
});
