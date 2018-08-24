/* jshint node:true */
module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    ts: {
      default : {
        tsconfig: './tsconfig.json'
        //src: ["**/*.ts", "!node_modules/**"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
