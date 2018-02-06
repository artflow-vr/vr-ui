'use strict';

let path = require( `path` );
let webpack = require( `webpack` );

const ROOT = __dirname;
const SRC = ROOT + `/src`;
const TEST = ROOT + `/test`;
const BUILD = `build`;
const ENTRY_FILE = SRC + `/vr-ui.js`;
const OUTPUT_FILE = `vr-ui`;

const ENV = require( `dotenv` ).config();

// Loaders used for the Library or Test configurations.
const ESLINT_LOADER = {
  test: /(\.jsx|\.js)$/,
  loader: `eslint-loader`,
  exclude: /node_modules/
};
// Plugins used for the Library or Test configurations.
const UGLIFY_PLUGIN = new webpack.optimize.UglifyJsPlugin( { minimize: true } );
const HOTRELOAD_PLUGIN = new webpack.HotModuleReplacementPlugin();

let modules = [path.resolve( __dirname, `src` ), `node_modules`];

//////
// Creates library and test config.
//////

// Library configuration.
let libConfig = {
  name: `library`,
  entry: ENTRY_FILE,
  output: {
    path: path.resolve( __dirname, BUILD + `/` ),
    filename: OUTPUT_FILE,
    publicPath: `/` + BUILD + `/`,
    library: `VRUI`
  },
  resolve: {
    modules: modules
  },
  plugins: [],
  module: {}
};

libConfig.module.loaders = [{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: `babel-loader`,
  query: {
    presets: [`es2015`]
  }
}];

// Test configuration.
let testConfig = {
  name: `test`,
  entry: TEST + `/test.js`,
  output: {
      path: path.resolve( __dirname, BUILD + `/` ),
      filename: `tests.js`,
      libraryTarget: `umd`,
      library: `VRUI`
  },
  resolve: {
    modules: [path.resolve( __dirname, `src` ), `node_modules`]
  },
  target: `node`,
  plugins: [
    new webpack.ProvidePlugin( {
      'THREE': `three`,
      'window.THREE': `three`
    } )
  ]
};

// Changes the plugins used if we are in a build,
// or in development.
if ( ENV.parsed.WEBPACK_CONFIG !== `build` ) {
    libConfig.output.filename = libConfig.output.filename + `.js`;
    libConfig.output.libraryTarget = `window`;
    libConfig.plugins.push( HOTRELOAD_PLUGIN );
} else {
  libConfig.output.filename = libConfig.output.filename + `.min.js`;
  libConfig.output.libraryTarget = `amd`;
  libConfig.plugins.push( UGLIFY_PLUGIN );
  libConfig.module.loaders.push( ESLINT_LOADER );
}

module.exports = [ libConfig, testConfig ];
