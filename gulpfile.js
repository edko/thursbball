var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var ngannotate = require('gulp-ng-annotate');
var closure = require('gulp-jsclosure');
var p = require('path');
var pump = require('pump');
var babel  = require('gulp-babel');
var es2015 = require('babel-preset-es2015');
var gulpNgConfig = require('gulp-ng-config');
var RevAll = require('gulp-rev-all');

var paths = {
	javascripts: [
		'./app/lib/angular/angular.min.js',
		'./app/lib/angular-ui-router/angular-ui-router.min.js',
		'./app/lib/angularfire/angularfire.min.js',
		'./app/lib/angular-animate/angular-animate.min.js',
		'./app/lib/angular-aria/angular-aria.min.js',
		'./app/lib/angular-material/angular-material.min.js',
		'./app/lib/angular-twilio/angular-twilio.js',
		'./app/lib/angular-spinners/angular-spinners.min.js',
		'./app/js/config.js',
		'./app/js/app.js',
		'./app/controllers/*.js',
		'./app/directives/*.js',
		'./app/services/*.js'
	],
	templates: [
		'./app/views/*.html',
		'./app/views/**/*.html'
	],
	node_modules: "./node_modules/",
	bower_components: "./bower_components/",
	lib_destination: "./app/lib/"
};

gulp.task('config', function () {
	gulp.src('config.json')
		.pipe(gulpNgConfig('bballapp.config', {
			environment: 'local'
		}))
		.pipe(gulp.dest('app/js'));
});

gulp.task('config:prod', function () {
	gulp.src('config.json')
		.pipe(gulpNgConfig('bballapp.config', {
			environment: 'production'
		}))
		.pipe(gulp.dest('app/js'));
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
});

gulp.task('watch', ['browserSync'], function(){
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);

});

gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		// .pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('clean:dist', function(){
	return del.sync('dist');
});

gulp.task('cache:clear', function(callback){
	return cache.clearAll(callback);
});

// gulp.task('build', function(callback){
// 	runSequence('clean:dist',
// 		['useref', 'images', 'fonts'],
// 		callback
// 	)
// });

gulp.task('fonts', function(){
	gulp.src('./app/lib/fonts/*.*')
		.pipe(gulp.dest('dist/fonts/'));
});

gulp.task('copy:libs', function(){
	var angular = gulp.src(paths.node_modules + 'angular/angular.min.js')
		.pipe(gulp.dest(paths.lib_destination + "angular"));
	var angularfire = gulp.src(paths.node_modules + 'angularfire/dist/angularfire.min.js')
		.pipe(gulp.dest(paths.lib_destination + "angularfire"));
	var firebase = gulp.src(paths.node_modules + 'firebase/firebase.js')
		.pipe(gulp.dest(paths.lib_destination + "firebase"));
	var animate = gulp.src(paths.node_modules + 'angular-animate/angular-animate.min.js')
		.pipe(gulp.dest(paths.lib_destination + "angular-animate"));
	var aria = gulp.src(paths.node_modules + 'angular-aria/angular-aria.min.js')
		.pipe(gulp.dest(paths.lib_destination + "angular-aria"));
	var angularmaterial = gulp.src([
		paths.node_modules + 'angular-material/angular-material.min.css',
		paths.node_modules + 'angular-material/angular-material.min.js'])
		.pipe(gulp.dest(paths.lib_destination + "angular-material"));
	var uirouter = gulp.src(paths.node_modules + 'angular-ui-router/release/angular-ui-router.min.js')
		.pipe(gulp.dest(paths.lib_destination + "angular-ui-router"));
	var twilio = gulp.src(paths.bower_components + "angular-twilio/angular-twilio.js")
		.pipe(gulp.dest(paths.lib_destination + "angular-twilio"));
	var mdi = gulp.src([
		paths.node_modules + 'mdi/css/materialdesignicons.min.css',
		paths.node_modules + 'mdi/css/materialdesignicons.min.css.map'])
		.pipe(gulp.dest(paths.lib_destination + "mdi"));
	var mdifonts = gulp.src(paths.node_modules + "mdi/fonts/*.*")
		.pipe(gulp.dest(paths.lib_destination + "fonts"));
	var spinners = gulp.src(paths.node_modules + "angular-spinners/dist/angular-spinners.min.js")
		.pipe(gulp.dest(paths.lib_destination + "angular-spinners"));
});

gulp.task('views', function(){
	gulp.src('./app/views/**/*')
		.pipe(gulp.dest('dist/views/'));
});

gulp.task('manifest', function(){
	gulp.src('./app/manifest.json')
		.pipe(gulp.dest('dist/'));
});

/**
* Takes html templates and transform them to angular templates (javascript)
*/
gulp.task('templates', function() {
	return gulp.src(paths.templates)
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(templateCache({
			module: 'myModule.templates',
			standalone: true,
			/**
			* Here, I'm removing .html so that `$templateCache` holds
			* the template in `views/home` instead of `views/home.html`.
			* I'm keeping the directory structure for the template's name
			*/
			transformUrl: function(url) {
				return url.replace(p.extname(url), '');
			}
		}))
		//put all those to our javascript file
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('scripts', ['templates'], function() {
	return gulp.src(paths.javascripts)
		.pipe(concat('main.js'))
		.pipe(ngannotate())
		.pipe(gulp.dest('./dist'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify({mangle: false}).on('error', function(e){
         	console.log(e);
    	}))
		.pipe(rename('main.min.js'))
		.pipe(RevAll.revision())
		.pipe(gulp.dest('./dist'))
		.pipe(RevAll.manifestFile())
		.pipe(gulp.dest('./dist'));
});

gulp.task('firebase', function(){
	gulp.src('./app/lib/firebase/firebase.js')
		.pipe(gulp.dest('./dist/lib/firebase/'));
});

gulp.task('production', ['clean:dist', 'firebase', 'scripts', 'views', 'fonts', 'images', 'useref']);

gulp.task('default', function(callback){
	runSequence(['browserSync', 'watch'], callback);
});
