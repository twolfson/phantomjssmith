// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
var smith = require('../lib/phantomjssmith');
module.exports = {
  'phantomjssmith': function () {
  },
  'interpretting an image file': function () {
    console.log(smith);
  },
  'gathers statistics on an image file':  function () {

  },
  'parsing many image files': function () {

  },
  'rendering them into a canvas': function () {

  },
  'can output an image':  function () {

  }
};