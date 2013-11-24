// Load in modules
var system = require('system'),
    fs = require('fs'),
    webpage = require('webpage');

// Grab the arguments
var args = system.args,
    filepath = args[1],
    encodedArg = fs.read(filepath);

// If there is no image, throw an error
if (!encodedArg) {
  throw new Error('No argument was specified.');
}

// Load the compose webpage
var page = webpage.create();
console.log(encodedArg);
phantom.exit();
page.open(phantom.libraryPath + '/compose.html?' + encodedArg, function (status) {
  // Pluck out the data png
  var retStr = page.evaluate(function () {
    return window.retStr;
  });

  // Export the pixel values
  console.log(retStr);

  // Leave the program
  phantom.exit();
});
