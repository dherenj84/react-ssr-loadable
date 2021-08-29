const { override, addWebpackPlugin, addBabelPlugin } = require("customize-cra");
const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = override(
  addBabelPlugin("@loadable/babel-plugin"),
  addWebpackPlugin(new LoadablePlugin())
);
