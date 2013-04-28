// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
var expect = require('chai').expect,
    smith = require('../lib/phantomjssmith');
module.exports = {
  'phantomjssmith': function () {
    // Do nothing
  },
  'interpretting an image file': function (done) {
    // Create an image and save it for later
    var filepath = __dirname + '/test_sprites/sprite1.png',
        that = this;
    smith.createImage(filepath, function (err, img) {
      that.img = img;
      done(err);
    });
  },
  'gathers statistics on an image file':  function () {
    expect(this.img).to.deep.equal({height: 50, width: 50});
  },
  'parsing many image files': function () {

  },
  'rendering them into a canvas': function () {

  },
  'can output an image':  function () {

  }
};