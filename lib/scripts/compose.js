// Load in modules
var system = require('system');
var fs = require('fs');
var webpage = require('webpage');

// Grab the arguments
var args = system.args;
var filepath = args[1];
var encodedArg = fs.read(filepath);

// If there is no image, throw an error
if (!encodedArg) {
  throw new Error('No argument was specified.');
}

// Load the compose webpage
var page = webpage.create();
page.open(phantom.libraryPath + '/compose.html', function (status) {
  // Grab the arguments
  var arg = decodeURIComponent(encodedArg);
  var params = JSON.parse(arg);

  // Run our method
  page.evaluate(function (params) {
    window.processCommand(params);
  }, params);

  // Fallback options
  var options = params.options || {};

  // Wait for retStr to exit with a default timeout of 10 seconds
  var count = 0;
  var timeout = (options.timeout || 10e3) / 100;
  function checkForRetStr() {
    // Pluck out the data png
    var retStr = page.evaluate(function () {
      return window.retStr;
    });

    if (!retStr) {
      count += 1;
      if (count > timeout) {
        console.log('Images not loaded within ' + (timeout / 10) + ' seconds. Timing out script.');
        return phantom.exit(1);
      }
      return setTimeout(checkForRetStr, 100);
    }

    // Export the pixel values
    console.log(retStr);

    // Leave the program
    page.close();
    setTimeout(function handlePageClose () {
      phantom.exit();
    }, 0);
  }
  checkForRetStr();
});
