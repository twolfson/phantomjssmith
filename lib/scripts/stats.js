// Load in modules
var system = require('system');
var fs = require('fs');
var webpage = require('webpage');
var async = require('./async.js');

// Grab the arguments
var args = system.args;
var filepath = args[1];
var encodedFilesStr = fs.read(filepath);

// If there is no image, throw an error
if (!encodedFilesStr) {
  throw new Error('No images specified to grab stats from.');
}

// Parse the image paths
var imgsStr = decodeURIComponent(encodedFilesStr);
var imgs = JSON.parse(imgsStr);

// In parallel
// DEV: Limit to 100 images at a time for OSX issues (magic number could be up to 200)
// DEV: https://github.com/Ensighten/grunt-spritesmith/issues/35
async.mapLimit(imgs, 100, function getStats (img, cb) {
  // Load in the stats webpage
  var page = webpage.create();
  page.open(phantom.libraryPath + '/stats.html', function (status) {
    // Run our method
    page.evaluate(function (img) {
      window.loadImage(img);
    }, img);

    // Wait for retStr to exit with a default timeout of 10 seconds
    var count = 0;
    var timeout = 10e3 / 100;
    function checkForRetStr() {
      // Pluck out the image stats
      var retStr = page.evaluate(function () {
        return window.retStr;
      });

      if (!retStr) {
        count += 1;
        if (count > timeout) {
          return cb(new Error('Image not loaded within ' + (timeout / 10) + ' seconds. Timing out script.'));
        }
        return setTimeout(checkForRetStr, 100);
      }

      // Leave the program
      page.close();
      setTimeout(function handlePageClose () {
        // Export the pixel values
        cb(null, JSON.parse(retStr));
      }, 0);
    }
    checkForRetStr();
  });
}, function handleStats (err, dimensionArr) {
  // If there was an error, log it and set a bad exit code
  var exitCode;
  if (err) {
    console.error(err);
    exitCode = 0;
  } else {
    // Otherwise, stringify and emit the dimensions
    var retStr = JSON.stringify(dimensionArr);
    console.log(retStr);
    exitCode = 1;
  }

  // Leave the program
  // DEV: We add a delay to verify all pages are closed
  //   Otherwise, we have issues like https://github.com/Ensighten/grunt-spritesmith/issues/100
  setTimeout(function verifyAllPagesClosed () {
    phantom.exit(exitCode);
  }, 100);
});

