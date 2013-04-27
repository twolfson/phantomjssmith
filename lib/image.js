/**
 * @param {String} file File path to load in
 * @param {Function} callback Error first callback to retrun the image from
 * @prop {Number} image.width
 * @prop {Number} image.height
 * @note Must be guaranteed to integrate into own library via .addImage
 */
function createImage(file, cb) {
  // Call createImages with an array
  createImages([file], function (err, dimensionArr) {
    // Fallback dimensionArr
    dimensionArr = dimensionArr || [];

    // Pluck out dimension and callback
    cb(err, dimensionArr[0]);
  });
}

// Mass image creation
var path = require('path'),
    cp = require('child_process'),
    exec = cp.exec,
    spawn = cp.spawn,
    Tempfile = require('temporary/lib/file');
function createImages(files, cb) {
  var tmp = new Tempfile(),
      filepath = tmp.path;

  // In series
  async.waterfall([
    // Grab the stats via phantomjs
    function getImgSize (cb) {
      // Stringify and escape (for CLI quote issues)
      var filesStr = JSON.stringify(files),
          encodedFilesStr = encodeURIComponent(filesStr);

      // Create a file and save to it
      tmp.writeFileSync(encodedFilesStr, 'utf8');

      // Call the stats phantomjs
      exec('phantomjs ' + __dirname + '/scripts/stats.js ' + filepath, cb);
    },
    function saveImgSize (stdout, stderr, cb) {
      // Parse the output
      var dimensionArr = JSON.parse(stdout);

      // Clean up the temporary file
      try { tmp.unlinkSync(); } catch (e) {}

      // Callback with the dimensions
      cb(null, dimensionArr);
    }
  ], cb);
}

// Export single image creation and mass image creation
module.exports = {
  createImage: createImage,
  createImages: createImages
};