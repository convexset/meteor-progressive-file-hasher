/* global File: true */
/* global PackageUtilities: true */
/* global ProgressiveFileHasher: true */
/* global CryptoJS: true */

ProgressiveFileHasher = (function(undefined) {
	'use strict';

	/*
	 * Progressive Hash Computations for HTML5 Files
	 */

	// ---------------------------------------------------

	/**
	 *  ProgressiveFileHasher Constructor
	 *  @param File file
	 *  @param Function options.callBack
	 *  @param boolean options.do_sha1
	 *  @param boolean options.do_sha256
	 *  @param int options.chunkSize
	 *  @param int options.sleep_period_between_processing
	 *  @return ProgressiveFileHasher pfh
	 */
	function ProgressiveFileHasher(file, options) {

		// Default Options
		options = PackageUtilities.updateDefaultOptionsWithInput({
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
			chunk_size: 262144, //524288, //1048576,

			// Sleep period between reads (to prevent locking up the UI)
			sleep_period_between_processing: 0
		}, options);

		//console.log("Hashing ", file, " (size", file.size, ") using chunk size", options.chunk_size);


		// Initialize algos to use
		var hashers = {};
		if (options.do_md5) {
			hashers.md5 = CryptoJS.algo.MD5.create();
		}
		if (options.do_sha1) {
			hashers.sha1 = CryptoJS.algo.SHA1.create();
		}
		if (options.do_sha256) {
			hashers.sha256 = CryptoJS.algo.SHA256.create();
		}
		var result = {
			// file_size: file.size,
		};

		// For returning results
		var is_complete = false;
		var getHashes = function getHashes() {
			if (!is_complete) {
				return null;
			} else {
				// Copy and Return
				var resultCopy = {};
				for (var k in hashers) {
					if (hashers.hasOwnProperty(k)) {
						resultCopy[k] = result[k];
					}
				}
				return resultCopy;
			}
		};
		this.getHashes = getHashes;

		// Obtain a blobSlice function to point to a slice of a file
		var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

		// Chunk accounting...
		var num_chunks = Math.ceil(file.size / options.chunk_size);
		var current_chunk = 0;

		// Prepare FileReader object
		var fileReader = new FileReader();
		fileReader.onload = function() {

			var h;
			// Incremental hashing
			for (h in hashers) {
				if (hashers.hasOwnProperty(h)) {
					hashers[h].update(CryptoJS.enc.Latin1.parse(fileReader.result));
				}
			}

			// Run update callback
			options.updateCallBack({
				chunk_number: current_chunk,
				loaded: current_chunk * options.chunk_size,
				total: file.size
			});

			// Check to see if there's more work, begin if necessary...
			// else call completion callback
			current_chunk++;
			if (current_chunk < num_chunks) {
				setTimeout(loadNext, options.sleep_period_between_processing);
			} else {
				for (h in hashers) {
					if (hashers.hasOwnProperty(h)) {
						result[h] = hashers[h].finalize().toString();
					}
				}
				is_complete = true;
				options.completionCallBack(null, getHashes());
			}
		};

		// Error... 
		fileReader.onerror = function() {
			options.completionCallBack(fileReader.error, null);
		};

		// Procedure for starting the next chunk of work!!
		function loadNext() {
			var start = current_chunk * options.chunk_size;
			var end = ((start + options.chunk_size) >= file.size) ? file.size : start + options.chunk_size;
			fileReader.readAsBinaryString(blobSlice.call(file, start, end));
		}

		loadNext();
	}

	// Wraps the result as a promise
	function asPromise(file, options) {
		return new Promise(function(resolve, reject) {
			// Default Options
			options = PackageUtilities.updateDefaultOptionsWithInput({
				completionCallBack: function() {},
				updateCallBack: function() {},
				do_sha1: true,
				do_sha256: false,
				chunk_size: 1048576,
				sleep_period_between_processing: 0
			}, options);

			var oldCompletionCallback = options.completionCallBack;
			options.completionCallBack = function(err, result) {
				oldCompletionCallback(err, result);
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			};

			new ProgressiveFileHasher(file, options);
		});
	}

	ProgressiveFileHasher.asPromise = asPromise;

	// Generate a function that takes a file and returns
	// a promise with the relevant pre-selected options
	function makePromiseFactory(options) {
		return function promiseFactory(file) {
			return asPromise(file, options);
		};
	}
	ProgressiveFileHasher.makePromiseFactory = makePromiseFactory;

	// Generate a function returns a promise to hash the selected file
	// using the relevant pre-selected options
	function makePackagedPromise(file, options) {
		return function promiseFactory() {
			return asPromise(file, options);
		};
	}
	ProgressiveFileHasher.makePackagedPromise = makePackagedPromise;

	// TODO: add web worker functionality

	return ProgressiveFileHasher;
})();