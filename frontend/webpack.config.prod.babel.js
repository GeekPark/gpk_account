import { optimize } from 'webpack';
import path from 'path';
import config from './webpack.config.babel';
import ManifestPlugin from 'webpack-manifest-plugin';

config.output.filename = '[name]_bundle-[chunkhash].js';
config.output.publicPath = 'http://7xjjng.com2.z0.glb.qiniucdn.com/static/';
config.output.path = path.join(__dirname, '../', 'public', 'static');

config.plugins = [...config.plugins, (
  new ManifestPlugin({
    fileName: 'webpack_manifest.json',
  })),
  (new optimize.UglifyJsPlugin({
    compress: {
      warnings: true,
    },
  })),
];

module.exports = config;
