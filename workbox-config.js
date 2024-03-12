module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,js,html,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};