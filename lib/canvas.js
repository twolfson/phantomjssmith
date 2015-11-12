// Load in our dependencies
var exportCanvas = require('./export-canvas');

// Define our canvas logic
function Canvas(params) {
  // Save the options for later
  this.params = params;

  // Create a store for images
  this.images = [];
}
Canvas.prototype = {
  addImage: function addImage (img, x, y) {
    // Save the image for later
    this.images.push({
      img: img,
      x: x,
      y: y
    });
  },
  'export': exportCanvas
};

// Export our canvas
module.exports = Canvas;
