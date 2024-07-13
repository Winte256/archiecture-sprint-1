const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('../webpack.common.js');
const deps = require('./package.json').dependencies;

module.exports = merge(commonConfig, {
  devServer: {
    port: 3000,
  },

  output: {
    publicPath: 'http://localhost:3000/',
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        places: 'places@http://localhost:3003/remoteEntry.js',
        profile: 'profile@http://localhost:3002/remoteEntry.js',
        auth: 'auth@http://localhost:3001/remoteEntry.js',
        shell: 'shell@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './Shell': './src/Shell.js',
        './CurrentUserContext': './src/contexts/CurrentUserContext',
        './InfoTooltip': './src/components/InfoTooltip',
        './ImagePopup': './src/components/ImagePopup',
        './PopupWithForm': './src/components/PopupWithForm',
        './api': './src/utils/api',
        './eventBus': './src/utils/eventBus'
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
        },
        './src/utils/eventBus',
        './src/contexts/CurrentUserContext.js',
        './src/utils/api.js',
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: './index.html',
    }),
  ],
});