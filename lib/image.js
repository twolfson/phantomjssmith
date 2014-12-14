// Mass image creation
var async = require('async'),
    shellQuote = require('shell-quote').quote,
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
    statsPath = shellQuote([__dirname + '/scripts/stats.js']);
function createImages(files, cb) {
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
      exec('phantomjs ' + statsPath + ' ' + filepath, function handleResult (err, stdout, stderr) {
        // If there was an error, callback with it
        if (err) {
          console.error('stderr', stderr);
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

      // Clean up the temporary file
      // try { tmp.unlinkSync(); } catch (e) {}

      // Save the file path for each image
      dimensionArr.forEach(function (dimension, i) {
        dimension._filepath = files[i];
      });

      // Callback with the dimensions
      cb(null, dimensionArr);
    }
  ], cb);
}

// Export single image creation and mass image creation
module.exports = {
  createImages: createImages
};