var gulp = require('gulp'),
// sass = require('gulp-ruby-sass'),
sass = require('gulp-sass');
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cleanCss = require('gulp-clean-css'),
rucksack = require('rucksack-css'),
sourcemaps = require('gulp-sourcemaps'),
plumber  = require('gulp-plumber'),
uglify  = require('gulp-uglify'),
imagemin  = require('gulp-imagemin'),
concat = require('gulp-concat'),
del = require('del'),
path = require('path'),
runSequence = require('run-sequence'),
lost = require('lost'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
opn = require('opn'),
templateSequence = require('./template-sequence.js');

var config = {
dest: './assets',
src: 'src',
bowerDir: 'bower_components'
};

gulp.task('clean', function (cb) {
return del([
    // path.join(config.dest, 'img'),
    path.join(config.dest, 'css'),
    // path.join(config.dest, 'js')
  ], {force: true});
});


gulp.task('styles', function() {
    var processors = [
        lost,
        autoprefixer,
        rucksack
    ];
    // sass('src/scss/**/*.scss', {
    //     sourcemaps: true,
    //     loadPath: [
    //         config.src,
    //         // config.bowerDir + '/bootstrap/scss',
    //     ]
    // })
    return gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    
    // .pipe(sourcemaps.init())
    // .pipe(sass({ style: 'compressed' }))

    .pipe(postcss(processors))
    // .pipe(cleanCss())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, 'css')))
    .pipe(connect.reload());    
   // .pipe(livereload());
});

// gulp.task('stylescombined', function() {
//     var processors = [
//         autoprefixer,
//         rucksack
//     ];
//     gulp.src('src/scss/combined.scss')
//     .pipe(plumber())
//     // .pipe(sourcemaps.init())
//     .pipe(sass({ style: 'compressed' }))
//     .pipe(postcss(processors))
//     .pipe(cleanCss())
//     // .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(path.join(config.dest, 'css')));
// });

gulp.task('js', function() {
// gulp.src('src/js/**/*.js')
// .pipe(plumber())
// .pipe(sourcemaps.init())
// .pipe(uglify())
// .pipe(concat('app.js'))
// .pipe(sourcemaps.write('.'))
// .pipe(gulp.dest(path.join(config.dest, 'js')));
});

gulp.task('image', function() {
gulp.src('src/img/*')
.pipe(imagemin())
.pipe(gulp.dest(path.join(config.dest, 'img')));
});

// gulp.task('default', ['clean', 'styles', 'js', 'image']);
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        ['styles', 'js'],
        callback
    );
});

gulp.task('watch:style', function() {
   // livereload.listen();
    gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('watch:js', function() {
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('html', function() {
    var variations = templateSequence.data; 
    Object.keys(variations).forEach(function(key) {
        gulp.src(variations[key])
            .pipe(concat(key+'.html'))
            .pipe(gulp.dest('./'))
            .pipe(connect.reload());        
    });
});

gulp.task('watch:html', function() {
    gulp.watch('src/templates/**/*.html', ['html']);
});


gulp.task('connect', function() {
    connect.server({
        name: 'Live Reload',
        root: ['./'],
        port: 9090,
        livereload: true
      });
    opn('http://localhost:9090');
});

gulp.task('watch',['watch:style','watch:js','watch:html', 'connect']);