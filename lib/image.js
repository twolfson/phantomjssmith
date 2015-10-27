// Load in our dependencies
var path = require('path');
var async = require('async');
var bufferedSpawn = require('buffered-spawn');
var Tempfile = require('temporary/lib/file');

// Define a mechanism for mass image conversion
function createImages(files, cb) {
  var tmp = new Tempfile();
  var filepath = tmp.path;

  // In series
  async.waterfall([
    // Grab the stats via phantomjs
    function getImgSize (cb) {
      // Stringify and escape (for CLI quote issues)
      var filesStr = JSON.stringify(files);
      var encodedFilesStr = encodeURIComponent(filesStr);

      // Create a file and save to it
      // TODO: Remove sync call
      tmp.writeFileSync(encodedFilesStr, 'utf8');

      // Call the stats phantomjs
      bufferedSpawn('phantomjs', [path.join(__dirname, 'scripts', 'stats.js'), filepath], cb);
    },
    function saveImgSize (stdout, stderr, cb) {
      // Parse the output
      var dimensionArr = JSON.parse(stdout);

      // Clean up the temporary file
      try { tmp.unlinkSync(); } catch (e) {}

      // Save the file path for each image
      dimensionArr.forEach(function saveDimensionFilepath (dimension, i) {
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
