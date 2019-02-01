var argv    = require('yargs').argv;
var usehtml = argv.usehtml;
var usertl  = argv.usertl;
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
    $.cleanCSS = require('gulp-clean-css');
    $.htmlBeautify = require('gulp-html-beautify');
var gutil       = require('gulp-util'),
    gulpsync    = require('gulp-sync')(gulp),
    path        = require('path'),
    glob        = require('glob'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    config      = require('./gulp.config')($, usehtml);
// production mode
var isProduction = false;
//---------------
// TASKS
//---------------
// APP LESS
gulp.task('styles', function () {
    log('Compiling styles from LESS to CSS..');
    return gulp.src(config.less.styles)
        .pipe(isProduction ? gutil.noop() : $.sourcemaps.init())
        .pipe($.less())
        .on("error", handleError)
        .pipe($.if(usertl, $.rtlcss()))
        .pipe(isProduction ? $.minifyCss() : gutil.noop())
        .pipe(isProduction ? gutil.noop() : $.sourcemaps.write("./"))
        .pipe(gulp.dest(config.distCSS));
});
// BOOSTRAP
gulp.task('bootstrap', function () {
    log('Compiling Bootstrap..');
    return gulp.src(config.bootstrap)
        .pipe(isProduction ? gutil.noop() : $.sourcemaps.init())
        .pipe($.less())
        .on("error", handleError)
        .pipe($.if(usertl, $.rtlcss()))
        .pipe(isProduction ? $.minifyCss() : gutil.noop())
        .pipe(isProduction ? gutil.noop() : $.sourcemaps.write("./"))
        .pipe(gulp.dest(config.distCSS));
});
// HTML
gulp.task('markup', ['index', 'views']);
gulp.task('views', buildMarkup(config.html.views, config.distHTML));
gulp.task('index', ['templatecache'], buildMarkup(config.html.index, '.', false, true));
gulp.task('templatecache', ['clean-scripts'], buildMarkup(config.html.templates, config.dist + 'js', true));
// SERVER
// -----------------------------------
gulp.task('webserver', function () {
    log('Starting web server.. ');
    return gulp.src(config.webserver.webroot)
        .pipe($.webserver(config.webserver));
});
//---------------
// WATCH
//---------------
// Rerun the task when a file changes
gulp.task('watch', function () {
    log('Starting watch with live reload ...');
    $.livereload.listen();
    gulp.watch([config.less.watch, config.less.styles], ['styles']);
    gulp.watch(config.bootstrap, ['bootstrap']);
    gulp.watch(config.html.all, ['markup']);
    gulp.watch(config.html.templates, ['templatecache']);
    gulp.watch(config.js, ['lint']);
    gulp
        .watch([].concat(config.less.watch, config.html.views, config.html.templates, config.js))
        .on('change', function (event) {
            setTimeout(function () {
                $.livereload.changed(event.path);
            }, 1400);
        });
});
/**
 * Clean
 */
gulp.task('clean', ['clean-scripts', 'clean-styles', 'clean-markup']);
gulp.task('clean-scripts', function (cb) {
    var js = config.distJS + '/*{js,map}';
    clean(js, cb);
});
gulp.task('clean-styles', function (cb) {
    var css = config.distCSS + '/*{css,map}';
    clean(css, cb);
});
gulp.task('clean-markup', function (cb) {
    var html = ['index.html', config.dist + 'views/'];
    clean(html, cb);
});
gulp.task('clean-build', function (cb) {
    log('Removing development assets');
    var delFiles = [
        config.distJS + '/' + config.tplcache.file,
        config.distCSS + '/bootstrap.css',
        config.distCSS + '/styles.css'
    ];
    clean(delFiles, cb);
});
/**
 * vet the code and create coverage report
 */
gulp.task('lint', function () {
    log('Analyzing source with JSHint');
    return gulp
        .src(config.lintJs)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});
//---------------
// MAIN TASKS
//---------------
// build for production
gulp.task('build', [], function (cb) {
    runSequence('clean', 'production', 'compile', 'clean-build', cb);
});
gulp.task('production', function () {
    isProduction = true;
});
// default (no minify, sourcemaps and watch)
gulp.task('default', function (callback) {
    runSequence('clean', 'compile', 'watch', 'done', callback);
}).task('done', done);
// serve development by default
gulp.task('serve', function (cb) {
    runSequence('default', 'webserver', cb);
});
// optional serve production
gulp.task('serve-build', function (cb) {
    runSequence('build', 'webserver', cb);
});
// run tasks without watch
gulp.task('compile', function (cb) {
    runSequence('styles', [
        'bootstrap',
        'templatecache',
        'markup'
    ], cb);
});
/////////////////
/**
 * Error handler
 */
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
/**
 * Build html templates
 * @param  {string} src           source files folder
 * @param  {string} dst           target folder
 * @param  {boolean} useTplcache  Should generate angular template cache
 * @return {stream}
 */
function buildMarkup(src, dst, useTplcache, useMin) {
    return function () {
        log('Compiling HTML...');
        if (useTplcache) log('Creating AngularJS templateCache..');
        return gulp.src(src)
            .pipe(isProduction ? gutil.noop() : $.changed(dst, {extension: '.html'}))
            .pipe($.if(!usehtml, $.jade({
                    locals: {
                        scripts: glob.sync(config.source + 'js/**/*.js')
                    }
                })
                )
            )
            .on("error", handleError)
            .pipe($.htmlBeautify(config.prettify))
            // .pipe($.angularHtmlify())
            .pipe(isProduction && useMin ?
                $.usemin(config.usemin)
                : gutil.noop()
            )
            .pipe(useTplcache ?
                $.angularTemplatecache(config.tplcache.file, config.tplcache.opts)
                : gutil.noop()
            )
            .pipe(gulp.dest(dst))
            ;
    }
}
/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}
/**
 * Just to be polite :)
 */
function done() {
    setTimeout(function () { // it's more clear to show msg after all
        log('Done.. Watching code and reloading on changes..');
    }, 500);
}
/**
 * Standard log
 */

function log(msg) {
    var prefix = '*** ';
    gutil.log(prefix + msg);
}