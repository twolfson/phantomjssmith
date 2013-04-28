// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
module.exports = {
  'phantomjssmith': {
    'interpretting an image file': {
      'gathers statistics on an image file': true
    },
    'parsing multiple images': {
      'rendering them into a canvas': {
        'can output an image': true
      }
    },
    'interpretting a ridiculous amount of images': {
      'rendering them into a canvas': {
        'does not crash': true,
        'returns an image': true
      }
    }
  }
};