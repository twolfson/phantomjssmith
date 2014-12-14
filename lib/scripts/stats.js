// Load in modules
var system = require('system'),
    fs = require('fs'),
    webpage = require('webpage'),
    async = require('./async.js');

console.error('hai');

// Grab the arguments
var args = system.args,
    filepath = args[1],
    encodedFilesStr = fs.read(filepath);
console.error('there');

// If there is no image, throw an error
if (!encodedFilesStr) {
  throw new Error('No images specified to grab stats from.');
}
console.error('wats');

// Parse the image paths
var imgsStr = decodeURIComponent(encodedFilesStr),
    imgs = JSON.parse(imgsStr);

console.error('up');
// In parallel
// DEV: Limit to 100 images at a time for OSX issues (magic number could be up to 200)
// DEV: https://github.com/Ensighten/grunt-spritesmith/issues/35
async.mapLimit(imgs, 100, function getStats (img, cb) {
console.error('yo');
  // Load in the image
  // DEV: If this fails, use data/html
  var page = webpage.create();
  page.open(img, function (status) {
    // Pluck out the image dimensions
    var dimensions = page.evaluate(function () {
      // Grab the image
      var img = document.getElementsByTagName('img')[0];

      // Get the dimensions of the image
      var style = window.getComputedStyle(img),
          dimensions = {
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
  console.log('~~');
  console.log(retStr);

  // Leave the program
  phantom.exit();
});

