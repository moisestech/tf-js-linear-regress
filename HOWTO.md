# HOW-TO

---

## NPM

1. **Run App** `npm start`
2. Webpack Hot Reloading and ./dist directory bundling.

### npm start

- **scripts**: `npm start` runs scripts: `{ "start": "webpack serve"}`,
  - webpack commmands are stored in package.json#scripts
  - alternatively run `npx webpack` or `node_modules/./bin/webpack`

---

## Package.JSON

### Packaging App

- **scripts**: `npm start` runs scripts: { "start": "webpack serve"},
- **main**: `webpack.config.js` is where webpack starts bundling from.

---

## WEBPACK HOW-TO

- [**Webpack**](https://www.npmjs.com/package/webpack): a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.
- [**webpack-cli**](https://www.npmjs.com/package/webpack-cli): is the interface we use to communicate with webpack. webpack CLI provides a set of tools to improve the setup of custom webpack configuration.
- [**webpack-dev-server**](https://www.npmjs.com/package/webpack-dev-server): Use webpack with a development server that provides live reloading. This should be used for development only.
  - It uses [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) under the hood, which provides fast in-memory access to the webpack assets.

### Plugins

- [**CopyWebpackPlugin**](https://www.npmjs.com/package/copy-webpack-plugin): Copies individual files or entire directories, which already exist, to the build directory.
- [**HtmlWebpackPlugin**](https://www.npmjs.com/package/html-webpack-plugin): Plugin that simplifies creation of HTML files to serve your bundles.
- [**CleanWebpackPlugin**](https://www.npmjs.com/package/clean-webpack-plugin): A webpack plugin to remove/clean your build folder(s).
- [**UglifyPlugin**](https://www.npmjs.com/package/uglifyjs-webpack-plugin): This plugin uses [uglify-js](https://github.com/mishoo/UglifyJS) to minify your JavaScript.

---

## BABEL HOW-TO

### Babel Loader

### Babel Presets

- **@babel/preset-env**: info coming soon.
- **@babel/preset-react**: info coming soon.

### Babel Plugins

- **@babel/plugin-transform-runtime**: info coming soon.
- **@babel/plugin-proposal-pipeline-operator**: info coming soon.
- **@babel/plugin-syntax-dynamic-import**: info coming soon.

---

## TREE

- Install Tree with Homebrew using `brew install tree`
- To create dir structure `tree -I 'node_modules|package-lock.json|dist'`
