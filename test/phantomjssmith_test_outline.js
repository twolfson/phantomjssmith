var extend = require('obj-extend'),
    outline = require('spritesmith-engine-test').outline;

outline.push({
  'running against very long URLs': [
    'does not crash',
    'returns an image'
  ]
});
outline.push({
  'with a custom timeout': [
    'times out very easily'
  ]
});

module.exports = {
  'phantomjssmith': outline
};