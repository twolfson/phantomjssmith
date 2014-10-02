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
    // Set up canvas for test case
    var multipleImages = spritesmithEngineTest.config.multipleImages;
    spritesmithUtils.interpretImages(phantomjssmith, multipleImages.filepaths);
    exports._createCanvas(phantomjssmith, multipleImages.width, multipleImages.height);
    exports._addImages(multipleImages.coordinateArr);

    // Run interesting piece of test case
    before(function exportWithLongMetadata (done) {
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
      var that = this;
      this.canvas['export']({format: 'png', longStr: longStr}, function (err, result) {
        that.result = result;
        done(err);
      });
    });
    after(function cleanupExport () {
      delete this.result;
    });

    it('does not crash', function () {
      // Would have thrown
    });
    it('returns an image', function () {
      expect(this.result).to.not.equal('');
    });
  });

  describe('with a custom timeout', function () {
    it('times out very easily', function () {

    });
  });
});

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