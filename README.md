# ProgressiveFileHasher

A Meteor package that provides a client-side file hasher that hashes progressively to reduce impact on the UI. Generates MD5, SHA1 and SHA256 hashes.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
    - [Basic Use](#basic-use)
    - [Via Promises](#via-promises)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

This is available as [`convexset:progressive-file-hasher`](https://atmospherejs.com/convexset/progressive-file-hasher) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:progressive-file-hasher`.)

If you get an error message like:
```
WARNING: npm peer requirements not installed:
 - package-utils@^0.2.1 not installed.
          
Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
```
It is because, by design, the package does not include instances of these from `npm` to avoid repetition. (In this case, `meteor npm install --save package-utils` will deal with the problem.)

See [this](http://guide.meteor.com/using-packages.html#peer-npm-dependencies) or [this](https://atmospherejs.com/tmeasday/check-npm-versions) for more information.

Now, if you see a message like
```
WARNING: npm peer requirements not installed:
underscore@1.5.2 installed, underscore@^1.8.3 needed
```
it is because you or something you are using is using Meteor's cruddy old `underscore` package. Install a new version from `npm`. (And, of course, you may use the `npm` version in a given scope via `require("underscore")`.)


## Usage

#### Basic Use

Given a file from an input object (e.g.: via `elem.files[idx]`)...

```javascript
var pfh = new ProgressiveFileHasher(file, {
	// Default options

	// Called when file is hashed in the following manner:
	// options.completionCallBack(error, result);
	completionCallBack: function() {},

	// Called when additional chunks are read in the following manner:
	// options.updateCallBack({
	//     chunk_number: current_chunk,
	//     loaded: current_chunk * options.chunk_size,
	//     total: file.size
	// });
	updateCallBack: function() {},

	// Whether to do MD5
	do_md5: true,

	// Whether to do SHA1
	do_sha1: true,

	// Whether to do SHA256
	do_sha256: false,

	// File chunk size to read
	chunk_size: 262144,

	// Sleep period between reads (to prevent locking up the UI)
	sleep_period_between_processing: 0
});
```

Check via `pfh.getHashes()` returns results such as
```javascript
{
    md5: "03ec47...",
    sha1: "67ed7...",
    sha256: "047..."
}
```
when complete, and `null` otherwise.


#### Via Promises

`ProgressiveFileHasher.asPromise(file, options)`: returns a promise that resolves to an object with the resulting hashes (as above) and rejects to the relevant error. The relevant options are as above. Notably, the completion callback is fired before the resolve/reject.

`ProgressiveFileHasher.makePromiseFactory(options)`: returns a function with signature `promiseFactory(file)`. Calling it with argument `file` returns the same result as `ProgressiveFileHasher.asPromise(file, options)`.

`ProgressiveFileHasher.makePackagedPromise(file, options)`: returns a function with signature `promiseFactory()`. Calling it with argument `file` returns the same result as `ProgressiveFileHasher.asPromise(file, options)`.



