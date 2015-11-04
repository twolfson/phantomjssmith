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

```javascript
// Convert images into phantomjssmith objects
var images = ['img1.jpg', 'img2.png'];
phantomjssmith.createImages(this.images, function handleImages (err, imgs) {
  // Create a canvas to draw onto (200 pixels wide, 300 pixels tall)
  phantomjssmith.createCanvas(200, 200, function (err, canvas) {
    // Add each image at a specific location (upper left corner = {x, y})
    var coordinatesArr = [{x: 0, y: 0}, {x: 50, y: 50}];
    imgs.forEach(function (img, i) {
      var coordinates = coordinatesArr[i];
      canvas.addImage(img, coordinates.x, coordinates.y);
    }, canvas);

    // Export canvas to image
    canvas['export']({format: 'png'}, function (err, result) {
      result; // Binary string representing a PNG image of the canvas
    });
  });
});
```

## Documentation
This module was built to the specification for spritesmith engines.

https://github.com/twolfson/spritesmith-engine-spec

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
