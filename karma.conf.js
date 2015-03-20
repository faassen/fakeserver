// see also:
// https://www.codementor.io/reactjs/tutorial/test-reactjs-components-karma-webpack

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // we use the mocha test runner integration
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // we just start with a single webpack file which launches our tests
    files: [
      'tests.webpack.js'
    ],

    // we want to write tdd tests, otherwise 'suite' is not available
    client: {
        mocha: {
            ui: 'tdd'
        }
    },

    // list of files to exclude
    exclude: [
    ],


    // we want to use webpack and sourcemap to process tests.webpack.js
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },

    // our webpack configuration: use babel, inline source maps
    webpack: {
        module: {
            loaders: [
                { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
            ]
        },
        devtool: 'inline-source-map',
    },
    // don't spam us with webpack info when runnin tests
    webpackServer: {
        noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
