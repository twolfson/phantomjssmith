// Load in our dependencies
var assert = require('assert');
var path = require('path');
var spawn = require('child_process').spawn;
var async = require('async');
var concat = require('concat-stream');
var Tempfile = require('temporary/lib/file');
var phantomLocation = require('which').sync('phantomjs');
var jpegJs = require('jpeg-js');
var ndarray = require('ndarray');
var savePixels = require('save-pixels');

/**
 * PhantomJS exporter
 * @param {Object} options Options to export with
 * @param {Number} [options.quality] Quality of the exported item (jpeg only)
 * @param {Function} cb Error-first callback to return binary image string to
 */
var defaultFormat = 'png';
var supportedFormats = ['jpeg', 'png', 'gif'];
function exportCanvas(options, callback) {
  // Determine the export format
  var format = options.format || defaultFormat;
  assert(supportedFormats.indexOf(format) !== -1,
    '`phantomjssmith` doesn\'t support exporting "' + format + '". Please use "jpeg" or "png"');

  // Localize context for later and create common variables
  var that = this;
  var params, tmp, stdout, stderr, code;

  // In series
  async.waterfall([
    function createTmpFile (cb) {
      // Convert over all image paths to url paths
      var images = that.images;
      images.forEach(function getUrlPath (img) {
        img = img.img;
        img._urlpath = path.relative(__dirname + '/scripts', img._filepath);
      });

      // Collect our parameters
      params = that.params;
      params.images = images;
      params.options = options;

      // Stringify our argument for phantomjs
      var arg = JSON.stringify(params);
      var encodedArg = encodeURIComponent(arg);

      // Write out argument to temporary file -- streams weren't cutting it
      tmp = new Tempfile();
      tmp.writeFile(encodedArg, 'utf8', cb);
    },
    function spawnPhantomJS (cb) {
      // Create a child process for phantomjs
      var phantomjs = spawn(phantomLocation, [path.join(__dirname, 'scripts', 'compose.js'), tmp.path]);
      phantomjs.on('error', cb);

      // When there is data, save it
      // DEV: encodedPixels is an array of rgba values
      stdout = '';
      phantomjs.stdout.on('data', function handleStdout (buffer) {
        stdout += buffer.toString();
      });

      // When there is an error, concatenate it
      stderr = '';
      phantomjs.stderr.on('data', function handleData (buffer) {
        // Ignore PhantomJS 1.9.2 OSX errors
        // https://github.com/Ensighten/grunt-spritesmith/issues/33
        var bufferStr = buffer.toString();
        var isNot192OSXError = bufferStr.indexOf('WARNING: Method userSpaceScaleFactor') === -1;
        var isNotPerformanceNote = bufferStr.indexOf('CoreText performance note:') === -1;
        if (isNot192OSXError && isNotPerformanceNote) {
          stderr += bufferStr;
        }
      });

      // When we are done, save the code and continue
      phantomjs.on('close', function handleClose (_code) {
        code = _code;
        cb();
      });
    },
    function deleteTmpFile (cb) {
      // Destroy the temporary file
      tmp.unlink(cb);
    },
    function handleResult (cb) {
      // If we received a non-zero exit code, complain and leave
      if (code !== 0) {
        var err = new Error('Received non-zero exit code "' + code + '" from PhantomJS. stdout:' + stdout);
        return cb(err);
      }

      // Otherwise, decode the pixel values
      // DEV: This used to be thinner and not need padding but Windows was messing up the image
      var encodedPixels = stdout;
      var decodedPixels;
      try {
        decodedPixels = JSON.parse(encodedPixels);
      } catch (e) {
        return cb(new Error('Error while parsing JSON "' + encodedPixels + '".\n' + e.message));
      }

      // If we are dealing with a `jpeg`, then use `jpeg-js`
      // DEV: This is to support `quality` which `save-pixels` doesn't
      if (format === 'jpeg') {
        // Encode our data via `jpeg-js` and callback with its internal buffer
        // TODO: When transitioning to a stream, use `contentstream`
        var jpg;
        try {
          jpg = jpegJs.encode({
            data: decodedPixels,
            width: params.width,
            height: params.height
          }, options.quality);
        } catch (err) {
          return cb(err);
        }
        cb(null, jpg.data.toString('binary'));
      // Otherwise, leverage `save-pixels`
      } else {
        // Convert the pixels into an ndarray
        // Taken from https://github.com/mikolalysenko/get-pixels/blob/2ac98645119244d6e52afcef5fe52cc9300fb27b/dom-pixels.js#L14
        var imgNdarray = ndarray(decodedPixels,
          [params.height, params.width, 4], [4 * params.width, 4, 1], 0);
        var imgStream = savePixels(imgNdarray, format);

        // Collect the stream into a buffer and callback with a binary string (expected by spritesmith)
        imgStream.on('error', cb);
        imgStream.pipe(concat(function handleBuffer (imgBuff) {
          cb(null, imgBuff.toString('binary'));
        }));
      }
    }
  ], callback);
}
module.exports = exportCanvas;
