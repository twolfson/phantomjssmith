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
var testUtils = spritesmithEngineTest.spritesmithUtils;
describe('phantomjssmith', function () {
  describe('running against very long URLs', function () {
    // Set up canvas for test case
    var multiplePngImages = spritesmithEngineTest.config.multiplePngImages;
    testUtils.interpretImages(phantomjssmith, multiplePngImages.filepaths);
    testUtils._createCanvas(phantomjssmith, multiplePngImages.width, multiplePngImages.height);
    testUtils._addImages(multiplePngImages.coordinateArr);

    // Run export with excessive meta data
    before(function exportWithLongMetadata (done) {
      // Generate a long string (looooooong)
      // https://github.com/twolfson/phantomjssmith/issues/3
      // DEV: Unfortunately, this test doesn't reproduce the issue on Linux
      var longStr = 'l';
      var i = 71663;
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
    // Set up canvas for test case
    var multiplePngImages = spritesmithEngineTest.config.multiplePngImages;
    testUtils.interpretImages(phantomjssmith, multiplePngImages.filepaths);
    testUtils._createCanvas(phantomjssmith, multiplePngImages.width, multiplePngImages.height);
    testUtils._addImages(multiplePngImages.coordinateArr);

    // Run export with short timeout
    before(function exportWithShortTimeout (done) {
      var that = this;
      this.canvas['export']({format: 'png', timeout: 1}, function (err, result) {
        that.err = err;
        that.result = result;
        done();
      });
    });
    after(function cleanupResults () {
      delete this.err;
      delete this.result;
    });

    it('times out very easily', function () {
      expect(this.err.message).to.contain('Timing out script.');
      expect(this.err.message).to.not.contain('Error while parsing JSON');
    });
  });
});
