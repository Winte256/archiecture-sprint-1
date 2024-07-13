const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const { merge } = require('webpack-merge');
const deps = require('./package.json').dependencies;
const commonConfig = require('../webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(commonConfig, {
  devServer: {
    port: 3002,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'profile',
      filename: 'remoteEntry.js',
      remotes: {
        shell: 'shell@http://localhost:3000/remoteEntry.js',
        auth: 'auth@http://localhost:3001/remoteEntry.js',
        profile: 'profile@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './Profile': './src/Profile',
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom'],
          },
        }
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
});
