module.exports = (grunt) ->
    require('load-grunt-tasks') grunt, pattern: ['grunt-contrib-*']

    grunt.initConfig
        watch:
          concat:
            tasks: 'concat'
            files: ['src/*.js', 'src/radial/*.js']

        concat:
          dist:
            src: [
                'src/*.js',
                'src/radial/Radial.js',
                'src/radial/*.js'
            ]
            dest: 'vis.js'

        jshint:
          vis: 'vis.js'
          spec: 'spec/*.js'
          options:
            jshintrc: '.jshintrc'

        uglify:
          c3:
            files:
              'vis.min.js': 'vis.js'

    grunt.registerTask 'default', ['concat', 'jshint', 'uglify']
