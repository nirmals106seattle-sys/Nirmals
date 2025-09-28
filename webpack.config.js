const CopyPlugin = require('copy-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const packageJson = require('./package.json');

const paths = {
  src: {
    favicon: './src/favicon',
    img: './src/img',
    js: './src/js',
    scss: './src/scss',
    json: './src/json', // 👈 JSON source
  },
  dist: {
    css: './assets/css',
    favicon: './assets/favicon',
    img: './assets/img',
    js: './assets/js',
    json: './assets/json', // 👈 JSON dist
  },
};

module.exports = {
  devtool: 'source-map',
  entry: {
    libs: [paths.src.scss + '/libs.scss'],
    theme: [paths.src.js + '/theme.js', paths.src.scss + '/theme.scss'],
    scrollup: [paths.src.js + '/scrollup.js'],
    scrolldown: [paths.src.js + '/scrolldown.js'],
    button: [paths.src.js + '/addbutton.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, paths.src.scss.slice(2)),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/](node_modules)[\\/].+\.js$/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: paths.dist.js + '/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),   // ✅ Output folder
    publicPath: '/',                         // ✅ Needed for dev server
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: paths.src.favicon,
          to: paths.dist.favicon,
        },
        {
          from: paths.src.img,
          to: paths.dist.img,
        },
        {
          from: paths.src.json, // ✅ copy JSON
          to: paths.dist.json,
        },
      ],
    }),
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), 'src', 'html', '**', '*.html'),
      output: path.join(process.cwd(), 'dist', '[path]', '[name].html'),
      partials: [path.join(process.cwd(), 'src', 'partials', '**', '*.{html,svg}')],
      helpers: {
        is: function (v1, v2, options) {
          const variants = v2.split(' || ');
          const isTrue = variants.some((variant) => v1 === variant);
          return isTrue ? options.fn(this) : options.inverse(this);
        },
        isnt: function (v1, v2, options) {
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        },
        webRoot: function () {
          return '{{webRoot}}';
        },
        themeVersion: function () {
          return '{{themeVersion}}';
        },
      },
      onBeforeSave: function (Handlebars, resultHtml, filename) {
        const level = filename.split('//').pop().split('/').length;
        const resultHtmlWithWebRoot = resultHtml.replaceAll('{{webRoot}}', '.'.repeat(level));
        const resultHtmlWithThemeVersion = resultHtmlWithWebRoot.replaceAll('{{themeVersion}}', packageJson.version);
        return resultHtmlWithThemeVersion;
      },
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: paths.dist.css + '/[name].bundle.css',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // ✅ serve dist folder
    },
    watchFiles: ['src/html/**/*', 'src/partials/**/*', 'src/json/**/*'],
  },
  target: 'web',
};
