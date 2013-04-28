// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    expect = require('chai').expect,
    smith = require('../lib/phantomjssmith'),
    imageDir = path.join(__dirname, 'test_sprites');
module.exports = {
  'phantomjssmith': function () {
    // Do nothing
  },
  'interpretting an image file': function (done) {
    // Create an image and save it for later
    var filepath = __dirname + '/test_sprites/sprite1.png',
        that = this;
    smith.createImages([filepath], function (err, imgs) {
      // Fallback images, save image, and callback
      imgs = imgs || [];
      that.img = imgs[0];
      done(err);
    });
  },
  'gathers statistics on an image file':  function () {
    expect(this.img).to.have.property('height', 50);
    expect(this.img).to.have.property('width', 50);
  },
  'parsing multiple images': function () {
    this.images = [
      path.join(imageDir, 'sprite1.png'),
      path.join(imageDir, 'sprite2.jpg'),
      path.join(imageDir, 'sprite3.png')
    ];
  },
  'interpretting a ridiculous amount of images': function () {
    // Create and save an array of 500 images
    var images = [],
        imagePath = path.join(imageDir, '16.jpg'),
        i = 500;
    while (i--) { images.push(imagePath); }
    this.images = images;
  },
  // TODO: Totally can flatten this out with doubleshot ;)
  'rendering them into a canvas': function (done) {
    var that = this;
    smith.createImages(this.images, function handleImages (err, imgs) {
      // If there is an error, callback with it
      if (err) { return done(err); }

      // Otherwise, draw them onto a canvas
      smith.createCanvas(100, 300, function (err, canvas) {
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
        imgs.forEach(function (img, i) {
          var coordinates = coordinatesArr[i];
          canvas.addImage(img, coordinates.x, coordinates.y);
        }, canvas);

        // Export canvas
        canvas['export']({format: 'png'}, function (err, result) {
          that.result = result;
          done(err);
        });
      });
    });
  },
  'can output an image':  function () {
    // Assert the actual image is the same expected
    var actualImage = this.result,
        expectedFilenames = ['phantomjs.png', 'phantomjs2.png'],
        expectedDir = __dirname + '/expected_files/',
        namespace = 'topDown.',
        matchesAnImage = false;

    // ANTI-PATTERN: Looping over set without identifiable lines for stack traces
    expectedFilenames.forEach(function testAgainstExpected (filename) {
      if (!matchesAnImage) {
        var filepath = path.join(expectedDir, namespace + filename),
            expectedImage = fs.readFileSync(filepath, 'binary');
        matchesAnImage = actualImage === expectedImage;
      }
    });

    expect(matchesAnImage).to.equal(true);
  },
  'does not crash': function () {
    // Would have thrown
  },
  'returns an image': function () {
    expect(this.result).to.not.equal('');
  }
};