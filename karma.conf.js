module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		// frameworks to use
		frameworks: ['jasmine'],

		preprocessors: {
			'**/*.ts': ['typescript']
		},

		typescriptPreprocessor: {
		  // options passed to the typescript compiler 
		  options: {
			
			target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5' 
			module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd' 
			noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type. 
			removeComments: true, // (optional) Do not emit comments to output.
			preserveConstEnums: true,
			sourceMap: false, // (optional) Generates corresponding .map file. 
			noResolve: true, // (optional) Skip resolution and preprocessing. 
			concatenateOutput: false // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false. 
		  },
		  // transforming the filenames 
		  transformPath: function(path) {
			return path.replace(/\.ts$/, '.js');
		  }
		},
	
		typescriptPreprocessor: {
		  options: {
			sourceMap: true, // generate source maps
			noResolve: false // enforce type resolution
		  },
		  transformPath: function(path) {
			return path.replace(/\.ts$/, '.js');
		  }
		},

		files: [
			'./app/*.ts',
			'./test/*.ts'
		],

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['dots'],

		// web server port
		port: 9873,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true,


	});
};
