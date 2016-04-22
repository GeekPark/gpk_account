const path = require('path');
const config = require('./webpack.config');
const ManifestPlugin = require('webpack-manifest-plugin');

config.output.filename = '[name]_bundle-[chunkhash].js';
config.output.publicPath = 'http://7xjjng.com2.z0.glb.qiniucdn.com/static/';
config.output.path = path.join(__dirname, '../', 'public', 'static');

config.plugins = config.plugins.concat([
  new ManifestPlugin({
    fileName: 'webpack_manifest.json',
  }),
]);

module.exports = config;
