var smith = require('../lib/phantomjssmith'),
    extend = require('obj-extend'),
    commonTest = require('spritesmith-engine-test').content;
module.exports = extend({}, commonTest, {
  'phantomjssmith': function () {
    this.smith = smith;

    var expectedDir = __dirname + '/expected_files/';
    this.expectedFilepaths = [expectedDir + '/multiple.png', expectedDir + '/multiple2.png'];
  },
  'running against very long URLs': ['parsing multiple images', function (done) {
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

        // Generate a long string (looooooong)
        // https://github.com/twolfson/phantomjssmith/issues/3
        var longStr = 'l',
            i = 10e6;
        while (i--) {
          longStr += 'o';
        }
        longStr += 'ng';

        // Export canvas with way too much meta data
        canvas['export']({format: 'png', longStr: longStr}, function (err, result) {
          console.log(result.length);
          that.result = result;
          done(err);
        });
      });
    });
  }]
});