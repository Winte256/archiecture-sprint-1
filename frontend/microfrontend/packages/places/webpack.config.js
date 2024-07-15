const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const { merge } = require('webpack-merge');
const commonDeps = require('../../package.json').dependencies;
const deps = require('./package.json').dependencies || {};
const commonConfig = require('../webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(commonConfig, {
  devServer: {
    port: 3003,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'places',
      filename: 'remoteEntry.js',
      remotes: {
        shell: 'shell@http://localhost:3000/remoteEntry.js',
        auth: 'auth@http://localhost:3001/remoteEntry.js',
        profile: 'profile@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './Places': './src/Places',
      },
      shared: [
        {
          ...deps,
          ...commonDeps,
          react: {
            singleton: true,
            requiredVersion: commonDeps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: commonDeps['react-dom'],
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: commonDeps['react-router-dom'],
          },
        }
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
});