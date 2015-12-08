Package.describe({
	name: 'convexset:progressive-file-hasher',
	version: '0.1.1',
	summary: 'A client-side file hasher that hashes progressively to reduce impact on the UI',
	git: 'https://github.com/convexset/meteor-progressive-file-hasher',
	documentation: '../../README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');
	api.use([
		'ecmascript',
		'underscore',
		'convexset:package-utils@0.1.8',
		'jparker:crypto-core@0.1.0',
		'jparker:crypto-md5@0.1.1',
		'jparker:crypto-sha1@0.1.0',
		'jparker:crypto-sha256@0.1.1'
	], 'client');
	api.addFiles(['progressive-file-hasher.js'], 'client');
	api.export(['ProgressiveFileHasher'], 'client');
});

Package.onTest(function(api) {
	api.use(['tinytest', 'test-helpers'], 'client');
	api.use(['ecmascript', 'underscore', 'convexset:progressive-file-hasher'], 'client');
	api.addFiles(['tests.js'], 'client');
});