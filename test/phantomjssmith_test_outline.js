// TODO: We could use inversion of control for a common testing module.
// This would allow for common test images, content, and isolation of those images to a `devDependency`
module.exports = {
  'phantomjssmith': require('./common_testoutline')
};