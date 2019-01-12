var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
gulp.task('sass', function() {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./src/css'))
})
gulp.task('watch', function() {
	return gulp.watch('./src/sass/*.scss', gulp.series('sass'));
})
gulp.task('server', function() {
	return gulp.src('src')
		.pipe(server({
			port: '9090',
			proxies: [{
					source: '/api/addUser',
					target: 'http://localhost:3000/users/api/addUser'
				},
				{
					source: '/api/classifylist',
					target: 'http://localhost:3000/classify/api/classifylist'
				},
				{
					source: '/api/addBill',
					target: 'http://localhost:3000/bill/api/addBill'
				},
				{
					source: '/api/getIcon',
					target: 'http://localhost:3000/classify/api/getIcon'
				},
				{
					source: '/api/addClassify',
					target: 'http://localhost:3000/classify/api/addClassify'
				},
				{
					source: '/api/getBill',
					target: 'http://localhost:3000/bill/api/getBill'
				},
				{
					source: '/api/delBill',
					target: 'http://localhost:3000/bill/api/delBill'
				}
			]
		}))
})
gulp.task('default', gulp.parallel('sass', 'server', 'watch'))
