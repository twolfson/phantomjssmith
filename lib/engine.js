// Load in our dependencies
var async = require('async');
var path = require('path');
var bufferedSpawn = require('buffered-spawn');
var Tempfile = require('temporary/lib/file');
var Canvas = require('./canvas');

// Define our engine constructor
function Phantomjssmith() {
  // No options for our engine
}
Phantomjssmith.specVersion = '2.0.0';
Phantomjssmith.prototype = {
  createCanvas: function (width, height) {
    // Create and return a new canvas
    var canvas = new Canvas({
      width: width,
      height: height
    });
    return canvas;
  },
  // Define a mechanism for mass image conversion
  createImages: function (files, cb) {
    // Downcast files from vinyl to strings
    files = files.map(function downcastFile (file) {
      // If the file is an object (i.e. a vinyl object)
      if (typeof file === 'object') {
        // If it's not null, warn the users about loading excess content
        if (!file.isNull()) {
          console.warn('`phantomjssmith` doesn\'t support in-memory content ' +
            'but we saw in-memory content for "' + file.path + '". ' +
            'This can be disabled via `read: false` in `gulp.src`');
        }

        // Use the file path from the vinyl object
        return file.path;
      // Otherwise, return the file (filepath)
      } else {
        return file;
      }
    });

    // Create a temporary file for reuse
    var tmp = new Tempfile();
    var filepath = tmp.path;
    var stdout, stderr;

    // In series
    async.waterfall([
      function outputInfoFile (cb) {
        // Stringify and escape (for CLI quote issues)
        var filesStr = JSON.stringify(files);
        var encodedFilesStr = encodeURIComponent(filesStr);

        // Save to our temporary file
        tmp.writeFile(encodedFilesStr, 'utf8', cb);
      },
      function getImgSize (cb) {
        // Call the stats phantomjs
        bufferedSpawn('phantomjs', [path.join(__dirname, 'scripts', 'stats.js'), filepath],
            function saveOutput (err, _stdout, _stderr) {
          stdout = _stdout;
          stderr = _stderr;
          cb(err);
        });
      },
      function deleteInfoFile (cb) {
        // Clean up the temporary file
        tmp.unlink(cb);
      },
      function saveImgSize (cb) {
        // Parse the output
        var dimensionArr = JSON.parse(stdout);

        // Save the file path for each image
        dimensionArr.forEach(function saveDimensionFilepath (dimension, i) {
          dimension._filepath = files[i];
        });

        // Callback with the dimensions
        cb(null, dimensionArr);
      }
    ], cb);
  }
};

// Expose Phantomjssmith
module.exports = Phantomjssmith;
