const path = require("path");
const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./server/index.js",
  module: {
    rules: [
      {
        test: /\.(js|tsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: ["@loadable/babel-plugin"],
          },
        },
        exclude: /node_modules/,
      }, // enable the following loaders as needed
      // {
      //   test: /\.(png|jp(e*)g|svg|gif)$/,
      //   use: ["file-loader"],
      // },
      // {
      //   test: /\.svg$/,
      //   use: ["@svgr/webpack"],
      // },
      {
        test: /\.svg$/,
        loader: "url-loader",
      },
      {
        test: /\.(scss|css)$/i,
        use: ["css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build/server"),
  },
  plugins: [new LoadablePlugin()],
};
