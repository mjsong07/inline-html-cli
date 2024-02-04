const HtmlWebpackPlugin = require('html-webpack-plugin');
class RemoveMainJsPlugin {
  apply(complier) {
    //这是一个异步的钩子
      complier.hooks.emit.tapAsync("HtmlWebpackPlugin", (compilation, cb) => {
        let html = compilation.assets["detail-all.html"].source();
        html = html.replaceAll(`<script type="text/javascript" src="main.js"></script>`,"") //这里去掉引入main.js的代码
        compilation.assets["detail-all.html"] = {
          source: function () {
            // 定义文件的内容
            return html;
          },
          size: function () {
            // 定义文件的体积
            return html.length;
          },
        };
        cb();//记得要调用回调cb才能往下进入下一个钩子
      });
    }
  }
module.exports = RemoveMainJsPlugin