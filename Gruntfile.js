/* jshint node:true */
module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    clean: {
      // compilation outputs
      tsc: [
        "dist/**/*.js",
        "dist/**/*.js.map",
        "dist/**/*.d.ts"
      ]
    },

    ts: {
      default: {
        tsconfig: "./tsconfig.json"
      }
    },

    tslint: {
      options: {
        configuration: "./tslint.json"
      },
      files: "src/**/*.ts"
    },

    watch: {
      ts: {
        files: ["src/**/*.ts"],
        tasks: ["default"]
      }
    },

    notify: {
      build: {
        options: {
          message: "Build ready"
        }
      },
      test: {
        options: {
          message: "Tests passed"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.registerTask("test", ["tslint", "notify:test"]);
  grunt.registerTask("build", ["clean:tsc", "tslint", "ts", "notify:build"]);
  grunt.registerTask("default", ["build", "watch"]);
};
