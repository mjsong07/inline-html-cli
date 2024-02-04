# 前端内联html脚手架 
 ## 1. 目的与效果
1. 有时候部分页面内容是通过富文本实现，维护这个富文本也需要工程化的支持，解决兼容和开发规范性问题。
2. 利用webpack打包工具，把html js css 合并成一个大html

## 2.使用
1. 安装
```sh
npm install
```
2. 启动开发
```sh
npm run dev
```
访问：http://localhost:9001/
默认端口9001

3. 构建
```sh
npm run build
```
构建后的detail-all.html为最终要上传到后台的富文本内容

4. 调试
只需要启动 `npm run dev`调试即可
访问：http://localhost:9001/

5. 发布
只需要启动 `npm run build`，复制detail-all.html到后台富文本即可
查看打包效果，可以右键生成的/dist/index.html 使用live server启动查看效果。
 

## 3.文件夹介绍
/src/content/detail.html detail.js detail.css : 实际开发的代码
/src/template: 为打包的时候需要用到的index页面与合并后detail-all.html提供模板格式 
 
 ## 4.原理
 1. 都是使用raw-loader在template/html页面直接动态引入，所以webpack.config.js中有些配置并不会生效，需要单独配置
 2. 由于没有使用webpack自带的index.js引入到网页，所以需要在构建的时候删除掉引入和实际输出的文件。

# 文章
https://juejin.cn/spost/7331257956004298764
