module.exports = function(grunt) {
    var fs = require('fs');
    
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');    
    
    grunt.initConfig({
        data: {
            version: grunt.option('build-number') || grunt.file.readJSON('bower.json').version || '',
            copyright: '2013-<%= grunt.template.today("yyyy") %> Jacob van Mourik',
        },
        connect: {
            main: {
                options: {
                    port: 8000,
                    base: './'
                }
            }
        },
        qunit: {
            main: {
                options: {
                    urls: fs.readdirSync('./tests')
                        .filter(function(file) {
                            return /\.html$/.test(file);
                        })
                        .map(function(file) {
                            return 'http://localhost:8000/tests/' + file;
                        })
                }
            }
        },
        replace: {
            main: {
                files: [{
					expand: true,
					flatten: true,
					src: ['require-i18next/i18next.js', 'require-i18next/i18next-builder.js'],
					dest: './require-i18next/'
				}],
                options: {
                    patterns: [{
                        match: /@version.*(\r?\n)/g,
                        replacement: '@version <%= data.version %>$1',
                    },  {
                        match: /@copyright.*(\r?\n)/g,
                        replacement: '@copyright <%= data.copyright %>$1',
                    }, {
                        match: /version: ".*"/g,
                        replacement: 'version: "<%= data.version %>"',
                    }]
                }
            },
            json: {
                files: [{
					expand: true,
					flatten: true,
					src: ['bower.json', 'package.json'],
					dest: './'
				}],
                options: {
                    patterns: [{
                        match: /"version": ".*"/g,
                        replacement: '"version": "<%= data.version %>"',
                    }]
                }
            }
        },
        uglify: {
            main: {
                files: {
                    'require-i18next/i18next.min.js': ['require-i18next/i18next.js']
                },
                options: {
                    banner: '/* RequireJS i18next Plugin v<%= data.version %> | (c) <%= data.copyright %> | MIT Licensed */\n'
                }
            }
        },
        jshint: {
            all: ['require-i18next/i18next.js', 'require-i18next/i18next-builder.js', 'tests/*.js']
        }
    });
    
    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('default', ['jshint', 'test', 'replace', 'uglify']);
};
