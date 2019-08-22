const gulp = require('gulp');
//const exec = require('gulp-exec');
var exec = require('child_process').exec;
const execa = require('execa');
var webserver = require('gulp-webserver');

var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


//-------------- child process - exec
gulp.task('one',async function(cb){
    exec('node --version', async function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    console.log('task one over');
});

gulp.task('two',async function(cb){
    exec('ncu', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      });
      console.log('task two over');
});

gulp.task('three', async function(cb){
    exec('ncu -u', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    console.log('task three over');
});


gulp.task('four', async function(cb){
    exec('npm install', function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    console.log('task four over');
});

//--------------------------------------------------------
//------node update
//--------------------------------------------------------
gulp.task('five', async function(cb){
    (async () => {
        const {stdout} = await execa('npm', ['install']);
        console.log(stdout);
    })();
});

gulp.task('six', async function(cb){
    (async () => {
        const {stdout} = await execa('ncu');
        console.log(stdout);
    })();
});

gulp.task('seven', async function(cb){
    (async () => {
        const {stdout} = await execa('ncu', ['-u']);
        console.log(stdout);
    })();
});

gulp.task('node-update', gulp.series('six', 'seven', 'five'));
//------------------------------------------------------------
//------------------------------------------------------------

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('html', function(){
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('css', function(){
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function(){
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});
gulp.task('copy', gulp.series('html', 'js'));

gulp.task('serve', function(){
    return gulp.src(paths.tmp).pipe(webserver({
        port:3001,
        livereload:true
    }));
});

gulp.task('build', gulp.series('copy', 'serve'));

//build task

gulp.task('html:dist', function(){
    return gulp.src(paths.srcHTML).pipe(htmlclean()).pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function(){
    return gulp.src(paths.srcCSS).pipe(cleanCSS()).pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function(){
    return gulp.src(paths.srcJS).pipe(uglify()).pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist', gulp.series('html:dist', 'css:dist', 'js:dist'));


