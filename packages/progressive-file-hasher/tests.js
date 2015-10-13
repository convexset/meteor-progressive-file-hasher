/* global ProgressiveFileHasher: true */
/* global File: true */
/* global testAsyncMulti: true */

testAsyncMulti('Progressive File Hashing Functionality', [

	function directEmptyFile(test, expect) {
		// test for null hashes
		var testFile = new File([''], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, 'd41d8cd98f00b204e9800998ecf8427e', '[Direct] Empty File (MD5)');
				test.equal(res.sha1, 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '[Direct] Empty File (SHA1)');
				test.equal(res.sha256, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '[Direct] Empty File (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
		});
	},
	function directShortFile(test, expect) {
		// test for non-null hashes
		var testFile = new File(['<a id="a"><b id="b">hey!</b></a>'], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, '5613dc9458112aa99a78f976322f79d0', '[Direct] Short File (MD5)');
				test.equal(res.sha1, 'e4ff72ddcec6c23adfcd10d4a620ceb8181ee53c', '[Direct] Short File (SHA1)');
				test.equal(res.sha256, '847b5b2feaf2ffeffb1820818dd08df238fe54e9c4f9d57f88fea4b15b33ae11', '[Direct] Short File (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 10, // 10 bytes
		});
	},
	function asPromise(test, expect) {
		var testFile = new File(['<a id="a"><b id="b">hey!</b></a>'], "fname", {
			type: 'text/html'
		});
		ProgressiveFileHasher.asPromise(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, '5613dc9458112aa99a78f976322f79d0', '[asPromise] Short File (MD5)');
				test.equal(res.sha1, 'e4ff72ddcec6c23adfcd10d4a620ceb8181ee53c', '[asPromise] Short File (SHA1)');
				test.equal(res.sha256, '847b5b2feaf2ffeffb1820818dd08df238fe54e9c4f9d57f88fea4b15b33ae11', '[asPromise] Short File (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 10,
			sleep_period_between_processing: 0
		});
	},
	function packagedPromise(test, expect) {
		var testFile = new File(['<a id="a"><b id="b">hey!</b></a>'], "fname", {
			type: 'text/html'
		});
		(ProgressiveFileHasher.makePackagedPromise(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, '5613dc9458112aa99a78f976322f79d0', '[Packaged Promise] Short File (MD5)');
				test.equal(res.sha1, 'e4ff72ddcec6c23adfcd10d4a620ceb8181ee53c', '[Packaged Promise] Short File (SHA1)');
				test.equal(res.sha256, '847b5b2feaf2ffeffb1820818dd08df238fe54e9c4f9d57f88fea4b15b33ae11', '[Packaged Promise] Short File (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 10,
			sleep_period_between_processing: 0
		}))();
	},
	function makePromiseFactory(test, expect) {
		var testFile = new File(['<a id="a"><b id="b">hey!</b></a>'], "fname", {
			type: 'text/html'
		});
		(ProgressiveFileHasher.makePromiseFactory({
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, '5613dc9458112aa99a78f976322f79d0', '[Promise Factory] Short File (MD5)');
				test.equal(res.sha1, 'e4ff72ddcec6c23adfcd10d4a620ceb8181ee53c', '[Promise Factory] Short File (SHA1)');
				test.equal(res.sha256, '847b5b2feaf2ffeffb1820818dd08df238fe54e9c4f9d57f88fea4b15b33ae11', '[Promise Factory] Short File (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 10,
			sleep_period_between_processing: 0
		}))(testFile);
	},
]);


testAsyncMulti('Progressive File Hashing: Other Options', [

	function emptyFileWithDefaultOptions(test, expect) {
		var testFile = new File([''], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, 'd41d8cd98f00b204e9800998ecf8427e', '[Default] Empty file with default options (MD5)');
				test.equal(res.sha1, 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '[Default] Empty file with default options (SHA1)');
				test.equal(res.sha256, undefined, '[Default] Empty file with default options (SHA256: Off by default)');
			}),
		});
	},
	function emptyFileWithNoMD5(test, expect) {
		var testFile = new File([''], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, undefined, '[No MD5] Empty file with no MD5 (MD5: Off)');
				test.equal(res.sha1, 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '[No MD5] Empty file with no MD5 (SHA1)');
				test.equal(res.sha256, undefined, '[No MD5] Empty file with no MD5 (SHA256: Off by default)');
			}),
			do_md5: false,
		});
	},
	function emptyFileWithNoSHA1(test, expect) {
		var testFile = new File([''], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, 'd41d8cd98f00b204e9800998ecf8427e', '[No SHA1] Empty file with no SHA1 (MD5)');
				test.equal(res.sha1, undefined, '[No SHA1] Empty file with no SHA1 (SHA1: Off)');
				test.equal(res.sha256, undefined, '[No SHA1] Empty file with no SHA1 (SHA256: Off by default)');
			}),
			do_sha1: false,
		});
	},
	function emptyFileWithSHA256(test, expect) {
		var testFile = new File([''], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, 'd41d8cd98f00b204e9800998ecf8427e', '[Do SHA256] Empty file with SHA256 (MD5)');
				test.equal(res.sha1, 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '[Do SHA256] Empty file with SHA256 (SHA1)');
				test.equal(res.sha256, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '[Do SHA256] Empty file with SHA256 (SHA256)');
			}),
			do_sha256: true,
		});
	},
	function smallChunks(test, expect) {
		var testFile = new File(['<a id="a"><b id="b">hey!</b></a>'], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			completionCallBack: expect(function(err, res) {
				test.equal(res.md5, '5613dc9458112aa99a78f976322f79d0', 'Small Chunks (MD5)');
				test.equal(res.sha1, 'e4ff72ddcec6c23adfcd10d4a620ceb8181ee53c', 'Small Chunks (SHA1)');
				test.equal(res.sha256, '847b5b2feaf2ffeffb1820818dd08df238fe54e9c4f9d57f88fea4b15b33ae11', 'Small Chunks (SHA256)');
			}),
			//updateCallBack: function(progress) {
			updateCallBack: function() {
				//console.log(progress)
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 4,
		});
	},
	function updateCallBackCalled(test, expect) {
		var htmlStr = '<a id="a"><b id="b">hey!</b></a>';
		var testFile = new File([htmlStr], "fname", {
			type: 'text/html'
		});
		new ProgressiveFileHasher(testFile, {
			//completionCallBack: function(err, res) {
			completionCallBack: expect(function() {
				test.equal(1, 1, 'Completion Callback Called');
			}),
			updateCallBack: function(progress) {
				test.equal(progress.total, htmlStr.length, 'Update Callback Called');
			},
			do_md5: true,
			do_sha1: true,
			do_sha256: true,
			chunk_size: 2 * htmlStr.length,
		});
	},
]);