/* jshint node:true */
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    clean: {
      // compilation outputs
      tsc: [
        'dist/**/*.js',
        'dist/**/*.js.map',
        'dist/**/*.d.ts'
      ]
    },

    ts: {
      default: {
        tsconfig: './tsconfig.json'
      }
    },

    watch: {
      ts: {
        files: ['src/**/*.ts'],
        tasks: ['default']
      }
    },

    notify: {
      build: {
        options: {
          message: "Build ready"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-ts');
  grunt.registerTask('build', ['clean:tsc', 'ts', 'notify:build']);
  grunt.registerTask('default', ['build', 'watch']);
};
