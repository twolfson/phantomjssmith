// Mass image creation
var async = require('async'),
    shellQuote = require('shell-quote').quote,
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file');
function createImages(files, callback) {
  var tmp = new Tempfile(),
      filepath = tmp.path;

  // In series
  async.waterfall([
    // Generate file with filepaths
    function createFilesFile (cb) {
      // Stringify and escape (for CLI quote issues)
      var filesStr = JSON.stringify(files),
          encodedFilesStr = encodeURIComponent(filesStr);

      // Create a file and save to it
      tmp.writeFile(encodedFilesStr, 'utf8', cb);
    },
    // Grab the stats via phantomjs
    function getImgSize (cb) {
      // Call the stats phantomjs
      var cmd = shellQuote(['phantomjs', __dirname + '/scripts/stats.js', filepath]);
      exec(cmd, function handleResult (err, stderr, stdout) {
        var a = stderr.split('~~');
        stderr = a[0];
        stdout = a[1];
        // If there was an error, callback with it
        if (err) {
          console.log('stderr', stderr);
          return cb(err);
        }

        // Otherwise, callback with stdout
        console.log('got stats');
        cb(null, stdout);
      });
    },
    function saveImgSize (stdout, cb) {
      // Parse the output
      var dimensionArr = JSON.parse(stdout);

      // Save the file path for each image
      dimensionArr.forEach(function (dimension, i) {
        dimension._filepath = files[i];
      });

      // Callback with the dimensions
      cb(null, dimensionArr);
    }
  ], function handleResult (err, result) {
    // Clean up the temporary file
    // try { tmp.unlinkSync(); } catch (e) {}

    callback(err, result);
  });
}

// Export single image creation and mass image creation
module.exports = {
  createImages: createImages
};