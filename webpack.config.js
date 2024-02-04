const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const RemoveMainJsPlugin = require("./plugins/remove-main-js-plugin");

module.exports = (env, argv) => {
  let plugins = []
  if (argv.mode === 'production') {
    plugins = plugins.concat( new CleanWebpackPlugin(
      {
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['main.js'], //删除main.js资源
      }
    ))
  }
  plugins = plugins.concat(
       // new MiniCssExtractPlugin({
        //   filename:'[name].css'
        // }),
        new htmlWebpackPlugin({
          title: "title",
          filename: "detail-all.html",
          template: "./src/template/detail-all.html",
          // inlineSource: '.css$',
          // chunks: ['vendors', pageName],
          // inject: true,
          minify: {
              html5: false,
              collapseWhitespace: false, //去空格
              preserveLineBreaks: false, //去换行
              minifyCSS: false,
              minifyJS: false,
              removeComments: false //去备注
          },
          templateParameters: {

          },
      }),
      // new HTMLInlineCSSWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: 'src/template/index.html'},
      ]),
      new RemoveMainJsPlugin()
  )

  return {
      entry: "./src/template/index.js", //暂时不使用
      output: {
          filename: "main.js",//利⽤占位符，⽂件名称不要重复
          path: path.resolve(__dirname, "dist")//输出⽂件到磁盘的⽬录，必须是绝对路径
      },
      module: {
        // rules: [
        //   {
        //       test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        //       exclude: /node_modules/,
        //       use: [
        //           {
        //               loader: 'url-loader', // 仅配置url-loader即可，内部会⾃动调⽤file-loader
        //               options: {
        //                 esModule: false,
        //                         limit: 100, //⼩于此值的⽂件会被转换成DataURL
        //                         name: '[name]_[hash:6].[ext]', // 设置输出⽂件的名字
        //                         // outputPath: 'assets', // 设置资源输出的⽬录
        //                       }
        //               }
        //         ]
        //   },
        //   {
        //     test: /\.css$/, //暂时未使用 都是用raw-loader直接加载
        //     use: [
        //       // "style-loader",
        //       // {
        //       //   loader: 'style-loader',
        //       //   options: {
        //       //     insertAt: 'top', // 样式插入到<head>
        //       //     singleton: true, //将所有的style标签合并成一个
        //       //   }
        //       // },
        //       // {
        //       //   loader:MiniCssExtractPlugin.loader,
        //       // },
        //       "css-loader",
        //       {
        //           loader: 'postcss-loader',
        //           options: {
        //               plugins: () => [
        //                   require('autoprefixer')({
        //                       browsers: ['last 2 version', '>1%', 'ios 7']
        //                   })
        //               ]
        //           }
        //       },
        //     ]
        //   },
        //   {
        //     test: /\.less$/, //暂时未使用 都是用raw-loader直接加载
        //     use: [
        //       "css-loader",
        //       {
        //           loader: 'postcss-loader',
        //           options: {
        //               plugins: () => [
        //                   require('autoprefixer')({
        //                       browsers: ['last 2 version', '>1%', 'ios 7']
        //                   })
        //               ]
        //           }
        //       },
        //       "less-loader",
        //     ]
        //   },
        //   {
        //       test: /.js$/,  //暂时未使用 都是用raw-loader直接加载
        //       use: [
        //           'babel-loader',
        //       ]
        //   },
        // ],
    },
      plugins: plugins,
      devServer: { 
        port: 9001,
      },
  };
}
