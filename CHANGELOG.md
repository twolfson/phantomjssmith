# phantomjssmith changelog
1.0.4 - Moved to Node.js>=4 to fix Travis CI

1.0.3 - Corrected CHANGELOG

1.0.2 - Upgraded to `spritesmith-engine-test@5.0.0`

1.0.1 - Replaced Gittip with support me page

1.0.0 - Upgraded to `spritesmith-engine-spec@2.0.0`

0.7.5 - Forgot to merge our branch

0.7.4 - Added `specVersion` to repo and added `spritesmith-engine` to keywords

0.7.3 - Added PhantomJS@2.0.0 to Travis CI

0.7.2 - Cleaned up documentation and linked to spritesmith-engine-spec

0.7.1 - Upgraded to `spritesmith-engine-test@3.0.0` to clean up technical debt

0.7.0 - Cleaned up technical debt (e.g. using `shell-quote`, synchronous writing to disk)

0.6.3 - Replaced `grunt` with `twolfson-style` for linting

0.6.2 - Updated supported node versions to `>= 0.10.0`

0.6.1 - Added `foundry` for release

0.6.0 - Moved to `phantomjs` detection to `postinstall` hook

0.5.4 - Added timeout for stats close to fix Windows stats bug. Fixes Ensighte/grunt-spritesmith#100

0.5.3 - Simplified annoying false negative failures of JPEG test

0.5.2 - Fixed accidental link in documentation

0.5.1 - Fixed `phantomjs@1.9.8` crashing issue. Fixes #8

0.5.0 - Added support for JPEG images

0.4.6 - Upgraded to `spritesmith-engine-test@2.0.0` and moved to `mocha`

0.4.5 - Fixed `npm install` inside of Travis CI for `node@0.8` issues

0.4.4 - Corrected typo in assert message via @yairEO in twolfson/gulp.spritesmith#19

0.4.3 - Upgraded to `spritesmith-engine-test@1.2.1` to remove per-repo expected images

0.4.2 - Upgraded `temporary` to fix `node@0.11`. Via @netroy

0.4.1 - Upgraded `npm` inside of Travis CI to fix `node@0.8` issue

0.4.0 - Added `timeout` option to `export`

0.3.0 - Moved to PhantomJS evaluate over URL passing of parameters. Fixes #3

0.2.4 - Added donation section to README

0.2.3 - Added expected file for tests against node@0.8

0.2.2 - Fix for broken tests on Windows

0.2.1 - Removed dev fs.writeFileSync

0.2.0 - Moved off of .toDataURL and onto .getImageData to significantly reduce output size. Fixes #46

0.1.11 - Fixed Mavericks performance message bug #45

0.1.10 - Fixed space directory bug #40

0.1.9 - Fixed OSX bug for PhantomJS 1.9.2 #33

0.1.8 - Fixed Windows bug for full phantomjs path

0.1.7 - Fixed OSX bug for concurrent stats on over 200 images #35

0.1.6 - Added Travis CI

Before 0.1.6 - See `git log`
