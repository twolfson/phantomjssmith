# phantomjssmith [![Build status](https://travis-ci.org/twolfson/phantomjssmith.png?branch=master)](https://travis-ci.org/twolfson/phantomjssmith)

[PhantomJS][phantomjs] engine for [spritesmith][].

[phantomjs]: http://phantomjs.org/
[spritesmith]: https://github.com/Ensighten/spritesmith

## Requirements
This depends on having `phantomjs` installed on your machine. This can be done globally as listed on [the PhantomJS website][phantomjs] or locally via the [node module wrapper][npm-phantomjs]. This module has been tested against `1.9.2` and `1.9.8`.

[npm-phantomjs]: https://github.com/Medium/phantomjs

### Global installation
[PhantomJS][phantomjs] installation instructions can be found on [the PhantomJS website][phantomjs]. When `phantomjssmith` is running, `phantomjs` must be resolvable via the `PATH` environment variable.

http://phantomjs.org/

### Local installation
A [phantomjs wrapper][npm-phantomjs] can be install via: `npm install phantomjs`

https://github.com/Medium/phantomjs

When running your `phantomjssmith` task, it must have `node_modules/.bin/` in the `PATH` environment variable. The easiest way to accomplish this is by using [`npm scripts`][npm-scripts]:

[npm-scripts]: https://docs.npmjs.com/misc/scripts

```js
// Inside our `package.json`
{
  "scripts": {
    "build": "grunt sprite"
  }
}
```

```bash
# Runs `grunt sprite` with `node_modules/.bin/` appended to `PATH`
npm run build
```

## Getting Started
Install the module with: `npm install phantomjssmith`

```js
// Load in our dependencies
var Phantomjssmith = require('phantomjssmith');

// Create a new engine
var phantomjssmith = new Phantomjssmith();

// Interpret some images from disk
phantomjssmith.createImages(['img1.jpg', 'img2.png'], function handleImages (err, imgs) {
  // If there was an error, throw it
  if (err) {
    throw err;
  }

  // We recieve images in the same order they were given
  imgs[0].width; // 50 (pixels)
  imgs[0].height; // 100 (pixels)

  // Create a canvas that fits our images (200px wide, 300px tall)
  var canvas = phantomjssmith.createCanvas(200, 300);

  // Add the images to our canvas (at x=0, y=0 and x=50, y=100 respectively)
  canvas.addImage(imgs[0], 0, 0);
  canvas.addImage(imgs[1], 50, 100);

  // Export canvas to image
  canvas['export']({format: 'png'}, function handleOuput (err, result) {
    result; // Binary string representing a PNG image of the canvas
  });
});
```

## Documentation
This module was built to the specification for spritesmith engines.

**Specification version:** 2.0.0

https://github.com/twolfson/spritesmith-engine-spec/tree/2.0.0

### `canvas.export(options, cb)`
Our `export` method provides support for the following options:

- options `Object`
    - timeout `Number` - Milliseconds to wait until automatically terminating PhantomJS script
        - By default, this is `10000` (10 seconds).
    - format `String` - Output image format to callback with. Currently, `png` and `jpeg` are available.
    - quality `Number` - If you are outputting a `jpeg`, the quality can be specified from 0 to 100.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint using `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
