// Load in dependencies
var expect = require('chai').expect;
var spritesmithEngineTest = require('spritesmith-engine-test');
var phantomjssmith = require('../lib/phantomjssmith');

// Start the normal test
spritesmithEngineTest.run({
  engine: phantomjssmith,
  engineName: 'phantomjssmith'
});

// Define phantomjssmith specific tests
describe('phantomjssmith', function () {
  describe('running against very long URLs', function () {
    // TODO: Continue defining test cases as altogether in an object
    spritesmithUtils.interpretImages(phantomjssmith, spritesmithEngineTest.config.multipleImages);
    exports._createCanvas = function (engine, width, height) {


    before(function exportWithLongMetadata () {

    });
      // If there is an error, callback with it
      if (err) { return done(err); }

      // Otherwise, draw them onto a canvas
      smith.createCanvas(that.width, that.height, function (err, canvas) {
        // If there is an error, callback with it
        if (err) { return done(err); }

        // Add each image
        var coordinatesArr = that.coordinateArr;
        imgs.forEach(function (img, i) {
          var coordinates = coordinatesArr[i];
          canvas.addImage(img, coordinates.x, coordinates.y);
        }, canvas);

        // Generate a long string (looooooong)
        // https://github.com/twolfson/phantomjssmith/issues/3
        // DEV: Unfortunately, this test doesn't reproduce the issue on Linux
        var longStr = 'l',
            i = 71663;
        while (i--) {
          longStr += 'o';
        }
        longStr += 'ng';

        // Export canvas with way too much meta data
        canvas['export']({format: 'png', longStr: longStr}, function (err, result) {
          that.result = result;
          done(err);
        });
      });
    });


    it('does not crash', function () {

    });
    it('returns an image', function () {

    });
  });

  describe('with a custom timeout', function () {
    it('times out very easily', function () {

    });
  });
});

  'running against very long URLs': ['parsing multiple images', function (done) {
  }],
  'with a custom timeout': ['parsing multiple images', function (done) {
    var that = this,
        smith = this.smith;
    smith.createImages(this.images, function handleImages (err, imgs) {
      // If there is an error, callback with it
      if (err) { return done(err); }

      // Otherwise, draw them onto a canvas
      smith.createCanvas(that.width, that.height, function (err, canvas) {
        // If there is an error, callback with it
        if (err) { return done(err); }

        // Add each image
        var coordinatesArr = that.coordinateArr;
        imgs.forEach(function (img, i) {
          var coordinates = coordinatesArr[i];
          canvas.addImage(img, coordinates.x, coordinates.y);
        }, canvas);

        // Export canvas
        canvas['export']({format: 'png', timeout: 1}, function (err, result) {
          that.err = err;
          that.result = result;
          done();
        });
      });
    });
  }],
  'times out very easily': function () {
    expect(this.err.message).to.contain('Timing out script.');
  }
});
