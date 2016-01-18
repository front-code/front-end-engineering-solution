'use strict';

var webpack = require('webpack');
var gulp = require('gulp');
var run = require('run-sequence');
var gutil = require('gulp-util');

var webpackConf = require('./webpack.config');

var paths = {
	"assets": "./assets"
}

gulp.task('default', ['pack'], function(){
    run('minhtmlAndRemoveScript');
});

// clean assets
gulp.task('clean', function() {
    var clean = require('gulp-clean');

    return gulp.src(paths.assets, {read: true}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});


gulp.task('minhtmlAndRemoveScript', function() {
    var replace = require('gulp-replace');
    var htmlmin = require('gulp-htmlmin');

    return gulp
        .src(paths.assets + '/**/*.html')
        .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
        // @see https://github.com/kangax/html-minifier
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.assets));
});