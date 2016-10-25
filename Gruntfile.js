'use strict';

module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = {
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['dist/*', 'doc/*', 'report/*', 'temp/*'],
			tests: ['test/*.lang.tests.html', 'test/*.min.tests.html']
		},
		concat: {
			options: {
				banner: '/*! http://keith-wood.name/datepick.html\n' +
					'   Datepicker localisations. */\n',
				stripBanners: false
			},
			lang: {
				src: 'src/js/jquery.datepick-*.js',
				dest: 'dist/js/jquery.datepick.lang.js'
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: ['*.html', 'css/*.*', 'img/*.*', 'js/*.*'],
						dest: 'dist'
					},
					{
						expand: true,
						cwd: 'src/bower_components/kbw-plugin/dist/js',
						src: ['*.*'],
						dest: 'dist/js'
					}
				]
			}
		},
		jsdoc: {
			options: {
				destination: 'doc'
			},
			all: ['src/js/*.js', '!src/js/*-*.js'],
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: ['src/js/*.js']
		},
		qunit: {
			options: {
				coverage: {
					disposeCollector: true,
					src: ['src/js/*.js', '!src/js/*-*.js'],
					instrumentedFiles: 'temp/',
					htmlReport: 'report/',
					linesThresholdPct: 80,
					statementsThresholdPct: 80,
					functionsThresholdPct: 75,
					branchesThresholdPct: 75
				}
			},
			all: ['test/*.html']
		},
		replace: {
			dist: {
				src: ['dist/index.html'],
				dest: 'dist/index.html',
				replacements: [
					{
						from: /bower_components\/jquery\/dist\/jquery.min.js/,
						to: 'http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
					},
					{
						from: /bower_components\/kbw-plugin\/dist\/jquery.plugin.min.js/,
						to: 'js/jquery.plugin.min.js'
					}
				]
			},
			testlang: {
				src: ['test/datepick.tests.html'],
				dest: 'test/datepick.lang.tests.html',
				replacements: [
				    {
						from: /src\/js\/jquery.*-.*\.js/g,
						to: 'dist/js/jquery.datepick.lang.js'
					}
				]
			},
			testmin: {
				src: ['test/datepick.tests.html'],
				dest: 'test/datepick.min.tests.html',
				replacements: [
				    {
						from: /src\/js\/jquery.*-.*\.js/g,
						to: 'dist/js/jquery.datepick.lang.min.js'
					},
				    {
						from: /src\/js\/jquery\.(.*)\.js/g,
						to: 'dist/js/jquery.$1.min.js'
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
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['*.js', '!*-*.js'],
						dest: 'dist/js',
						ext: '.min.js',
						extDot: 'last'
					},
					{
						src: 'dist/js/jquery.datepick.lang.js',
						dest: 'dist/js/jquery.datepick.lang.min.js'
					}
				]
			}
		},
		zip: {
			all: {
				cwd: 'dist',
				src: ['dist/*.html', 'dist/css/*.*', 'dist/img/*.*', 'dist/js/*.*'],
				dest: 'dist/jquery.datepick.package-<%= pkg.version %>.zip'
			}
		}
	};
	
	grunt.initConfig(config);

	grunt.registerTask('dist', [
		'copy:dist',
		'replace:dist',
		'zip'
	]);

	grunt.registerTask('test', [
		'replace:testlang',
		'replace:testmin',
		'qunit',
		'clean:tests'
	]);

	grunt.registerTask('default', [
		'clean:build',
		'jshint',
		'concat',
		'uglify',
		'test',
		'jsdoc',
		'dist'
	]);
};
