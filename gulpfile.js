var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var reload = browserSync.reload;
var prettify = require('gulp-html-prettify');
var autoprefixer = require('gulp-autoprefixer');
var gcmq = require('gulp-group-css-media-queries');
var csscomb = require('gulp-csscomb');
var plumber = require('gulp-plumber');
var errorHandler = require('gulp-plumber-error-handler');

// jade
gulp.task('templates', function() {

	return gulp.src('./app/templates/pages/*.jade')
		.pipe(plumber({errorHandler: errorHandler(`Error in \'jade\' task`)}))
		.pipe(jade())
		.pipe(prettify({
			brace_style: 'expand',
			indent_size: 1,
			indent_char: '\t',
			indent_inner_html: true,
			preserve_newlines: true
		}))
		.pipe(gulp.dest('./html/'));
});

// reload jade
gulp.task('jade-watch', ['templates'], reload);

// style (autoprefixer, css combo, sass )
gulp.task('sass', function () {
	return gulp.src('./app/scss/*.scss')
		.pipe(plumber({errorHandler: errorHandler(`Error in \'sass\' task`)}))
		.pipe(sass())
		.pipe(gulp.dest('./html/assets/styles'))
		.pipe(autoprefixer({
			browsers: [ 'last 2 version', 'ie 9', 'ios 8', 'android 4' ],
			cascade: false
		}))
		.pipe(csscomb())
		.pipe(gcmq())
		.pipe(gulp.dest('./html/assets/styles'))
		.pipe(reload({stream: true}));
});

// copy files (robots.txt & favicons)
gulp.task('copy-resources', function() {
	gulp.src('./app/resources/**/*')
	.pipe(gulp.dest('./html/'));
});

// run tasks
gulp.task('default', ['sass', 'templates', 'copy-resources'], function () {
	browserSync({server: './html'});
	gulp.watch([
		'./app/scss/**/*.scss',
		'./app/scss/*.scss'],['sass']);
	gulp.watch([
		'./app/templates/layout/*.jade',
		'./app/templates/pages/*.jade',
		'./app/templates/sections/*.jade',
		'./app/templates/modules/*.jade',
		'./app/templates/scripts/*.jade',
		'./app/templates/blocks/*.jade'], ['jade-watch']);
});
