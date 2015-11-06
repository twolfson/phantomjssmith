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
  // Load in the image
  // DEV: If this fails, use data/html
  var page = webpage.create();
  console.log(img);
  page.open('data:text/html;charset=utf-8,<img src="file://' + img + '"/>', function (status) {
    // Pluck out the image dimensions
    var dimensions = page.evaluate(function () {
      // Grab the image
      var img = document.getElementsByTagName('img')[0];

      // Get the dimensions of the image
      console.log(img);
      var dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      return dimensions;
    });

    // Callback with the dimensions
    page.close();
    setTimeout(function handlePageClose () {
      cb(null, dimensions);
    }, 0);
  });
}, function handleStats (err, dimensionArr) {
  // Stringify and emit the dimensions
  var retStr = JSON.stringify(dimensionArr);
  console.log(retStr);

  // Leave the program
  // DEV: We add a delay to verify all pages are closed
  //   Otherwise, we have issues like https://github.com/Ensighten/grunt-spritesmith/issues/100
  setTimeout(function verifyAllPagesClosed () {
    phantom.exit();
  }, 100);
});

