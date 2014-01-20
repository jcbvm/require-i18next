module.exports = function(grunt) {

    var fs = require('fs'),
        testFiles = fs.readdirSync('./tests'), 
        testUrls = [];
    
    for (var i = 0, l = testFiles.length; i < l; i++) {
        if (/^(?!index).*\.html$/.test(testFiles[i])) {
            testUrls.push('http://localhost:8000/tests/' + testFiles[i]);
        }
    }
    
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
                    urls: testUrls
                }
            }
        },
        replace: {
            main: {
                files: [{
                    src: ['i18next.js', 'i18next-builder.js'],
                    dest: './'
                }],
                options: {
                    patterns: [{
                        match: /@version.*\n/g,
                        replacement: '@version <%= data.version %>\n',
                    },  {
                        match: /@copyright.*\n/g,
                        replacement: '@copyright <%= data.copyright %>\n',
                    }, {
                        match: /version: ".*"/g,
                        replacement: 'version: "<%= data.version %>"',
                    }]
                }
            },
            json: {
                files: [{
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
                    'i18next.min.js': ['i18next.js']
                },
                options: {
                    banner: '/* RequireJS i18next Plugin v<%= data.version %> | (c) <%= data.copyright %> | MIT Licensed */\n'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');
    
    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('default', ['test', 'replace', 'minify']);
};
