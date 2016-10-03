'use strict';

module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = {
		clean: {
			build: {
				files: [
					{
						dot: true,
						src: ['dist/*', '!dist/.git', 'doc/*', 'package/*']
					}
				]
			},
			package: {
				files: [
					{
						dot: true,
						src: ['src/js/*.min.js', 'src/js/*.map', 'src/js/*lang.js']
					}
				]
			},
			tests: {
				files: [
					{
						dot: true,
						src: ['test/*.lang.tests.html', 'test/*.min.tests.html']
					}
				]
			}
		},
		concat: {
			options: {
				banner: '/*! http://keith-wood.name/datepick.html\n' +
					'   Datepicker localisations. */\n',
				stripBanners: false
			},
			lang: {
				src: 'src/js/jquery.datepick-*.js',
				dest: 'dist/jquery.datepick.lang.js'
			}
		},
		copy: {
			package: {
				files: [
					{
						expand: true,
						cwd: 'dist',
						src: ['*.*'],
						dest: 'src/js'
					}
				]
			}
		},
		jsdoc: {
			options: {
				destination: 'doc'
			},
			all: {
				src: ['src/js/jquery.*.js', '!src/js/jquery.*-.*.js'],
			}
		},
		jshint: {
			all: ['src/js/jquery.*.js']
		},
		qunit: {
			all: ['test/**/*.html']
		},
		replace: {
			langtest: {
				src: ['test/datepick.tests.html'],
				dest: 'test/datepick.lang.tests.html',
				replacements: [
				    {
						from: /src\/js\/jquery.*-.*\.js/g,
						to: 'dist/jquery.datepick.lang.js'
					}
				]
			},
			mintest: {
				src: ['test/datepick.tests.html'],
				dest: 'test/datepick.min.tests.html',
				replacements: [
				    {
						from: /src\/js\/jquery.*-.*\.js/g,
						to: 'dist/jquery.datepick.lang.min.js'
					},
				    {
						from: /src\/js\/jquery\.(.*)\.js/g,
						to: 'dist/jquery.$1.min.js'
					}
				]
			}
		},
		uglify: {
			options: {
				preserveComments: 'some',
				sourceMap: true
			},
			plugin: {
				files: {
					'dist/jquery.datepick.min.js': ['src/js/jquery.datepick.js'],
					'dist/jquery.datepick.ext.min.js': ['src/js/jquery.datepick.ext.js'],
					'dist/jquery.datepick.validation.min.js': ['src/js/jquery.datepick.validation.js'],
					'dist/jquery.datepick.lang.min.js': ['dist/jquery.datepick.lang.js']
				}
			}
		},
		zip: {
			all: {
				cwd: 'src',
				src: ['src/*.html', 'src/css/*.datepick.css', 'src/img/*.gif',
					'src/js/jquery.datepick*.js', 'src/js/jquery.datepick*.map'],
				dest: 'package/jquery.datepick.package.zip'
			}
		}
	};
	
	grunt.initConfig(config);

	grunt.registerTask('package', [
		'copy:package',
		'zip',
		'clean:package'
	]);

	grunt.registerTask('test', [
		'replace',
		'qunit',
		'clean:tests'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'jshint',
		'concat',
		'uglify',
		'test',
		'jsdoc',
		'package'
	]);
};
