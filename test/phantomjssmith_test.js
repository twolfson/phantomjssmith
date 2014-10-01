// Load in dependencies
var extend = require('obj-extend');
var spritesmithEngineTest = require('spritesmith-engine-test');
var phantomjssmith = require('../lib/phantomjssmith');

// Start the normal test
spritesmithEngineTest({
  engine: phantomjssmith,
  engineName: 'phantomjssmith'
});
