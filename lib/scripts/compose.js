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
page.open(phantom.libraryPath + '/compose.html', function (status) {
  // Grab the arguments
  var arg = decodeURIComponent(encodedArg),
      params = JSON.parse(arg);

  // Run our method
  page.evaluate(function (params) {
    window.processCommand(params);
  }, params);

  // Wait for retStr to exit
  var count = 0;
  function checkForRetStr() {
    // Stop early if there was an error and we replied
    if (errorEncountered) {
      return;
    }

    // Pluck out the data png
    var retStr = page.evaluate(function () {
      return window.retStr;
    });

    if (!retStr) {
      count += 1;
      if (count > 100) {
        console.log('Images not loaded within 10 seconds. Timing out script.');
        return phantom.exit(1);
      }
      return setTimeout(checkForRetStr, 100);
    }

    // Export the pixel values
    console.log(retStr);

    // Leave the program
    phantom.exit();
  }
  checkForRetStr();
});
