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
      exec(cmd, cb);
    },
    function saveImgSize (stdout, stderr, cb) {
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
    tmp.unlink(function handleUnlink (_err) {
      // Ignore error
      // Callback with the results
      callback(err, result);
    });
  });
}

// Export single image creation and mass image creation
module.exports = {
  createImages: createImages
};