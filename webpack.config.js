'use strict';

let path = require( `path` );
let webpack = require( `webpack` );

let ROOT = __dirname;
let SRC = ROOT + `/src`;
let BUILD = `build`;

let ENTRY_FILE = SRC + `/vr-ui.js`;
let OUTPUT_FILE = `vr-ui`;

let env = require( `dotenv` ).config();

let plugins = [];
let loaders = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: `babel-loader`,
    query: {
      presets: [`es2015`]
    }
  }
];

let exp = {
  entry: ENTRY_FILE,
  output: {
    path: path.resolve( __dirname, BUILD + `/` ),
    filename: null,
    publicPath: `/` + BUILD + `/`,
    library: `VRUI`
  },
  module: {}
};

if ( env.parsed.WEBPACK_CONFIG !== `build` ) {
    OUTPUT_FILE = OUTPUT_FILE + `.js`;
    plugins.push( new webpack.HotModuleReplacementPlugin() );
} else {
  OUTPUT_FILE = OUTPUT_FILE + `.min.js`;
  plugins.push( new webpack.optimize.UglifyJsPlugin( { minimize: true } ) );
  loaders.push( {
    test: /(\.jsx|\.js)$/,
    loader: `eslint-loader`,
    exclude: /node_modules/
  } );
}

exp.output.filename = OUTPUT_FILE;
exp.plugins = plugins;
exp.module.loaders = loaders;

module.exports = exp;
