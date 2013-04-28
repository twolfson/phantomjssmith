// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
var path = require('path'),
    async = require('async'),
    expect = require('chai').expect,
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
    expect(this.img).to.have.property('height', 50);
    expect(this.img).to.have.property('width', 50);
  },
  'parsing multiple images': function () {
    var imageDir = path.join(__dirname, 'test_sprites');
    this.images = [
      path.join(imageDir, 'sprite1.png'),
      path.join(imageDir, 'sprite2.jpg'),
      path.join(imageDir, 'sprite3.png')
    ];
  },
  'rendering them into a canvas': function (done) {
    var that = this;
    async.map(this.images, smith.createImage, function handleImages (err, imgs) {
      // If there is an error, callback with it
      if (err) { return done(err); }

      // Otherwise, draw them onto a canvas
      smith.createCanvas(300, 100, function (err, canvas) {
        // If there is an error, callback with it
        if (err) { return done(err); }

        // Add each image
        var coordinatesArr = [{
                "x": 0,
                "y": 0,
            }, {
                "x": 0,
                "y": 50,
            }, {
                "x": 0,
                "y": 100,
            }];
        // TODO: We might have found a leak in the exporter if they require filename -_-
        // TODO: Stop spending so much time on this -- worst case, mark it as an GitHub issue and get back to being productive
        imgs.forEach(function (img, i) {
          var coordinates = coordinatesArr[i];
          canvas.addImage(img, coordinates.x, coordinates.y);
        }, canvas);
        console.log('going');

        console.log('going');
        // Export canvas
        canvas['export']({format: 'png'}, function (err, result) {
          console.log('whee');
          that.result = result;
          done(err);
        });
      });
    });
  },
  'can output an image':  function () {
    console.log(this.result);
  }
};