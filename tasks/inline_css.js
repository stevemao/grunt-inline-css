/*
 * grunt-inline-css
 * https://github.com/jgallen23/grunt-inline-css
 *
 * Copyright (c) 2013 Greg Allen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var juice = require('juice');

  grunt.registerMultiTask('inlineCss', 'Takes an html file with css link and turns inline.  Great for emails.', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();
    var done = this.async();
    var index = 0;
    var count = this.files.length;

    // Iterate over all specified file groups.
    if (count === 0) {
      var folders = this.data.folders;
      var fs = require('fs');
      count = 0;

      for (var folderDest in folders) {
        if (folders.hasOwnProperty(folderDest)) {
          var folderSrc = folders[folderDest];
          var files = fs.readdirSync(folderSrc);

          count = 0;
          for (var i = 0; i < files.length;) {
            var fileName = files[i];
            if (fileName[0] !== '.' && fileName.indexOf('.html') > 0) {
              count++;
              i++;
            } else {
              files.splice(i, 1);
            }
          }

          files.forEach(function (fileName) {
            var file = {
              src: folderSrc + '/' + fileName,
              dest: folderDest + '/' + fileName
            };
            inlinCss(file);
          });
        }
      }
    } else {
      this.files.forEach(function (file) {
        inlinCss(file);
      });
    }

    function inlinCss(file) {
      var filepath = file.src.toString();
      if (typeof filepath !== 'string' || filepath === '') {
        grunt.log.error('src must be a single string');
        return false;
      }

      if (!grunt.file.exists(filepath)) {
        grunt.log.error('Source file "' + filepath + '" not found.');
        return false;
      }

      juice(filepath, options, function (err, html) {

        if (err) {
          return grunt.log.error(err);
        }

        grunt.file.write(file.dest, html);
        grunt.log.writeln('File "' + file.dest + '" created.');


        index++;
        if (index === count) {
          done();
        }

      });
    }

  });

};
