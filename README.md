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




# 新增批处理图片

## 实现:
1. 本地文件夹的资源遍历
2. 根据自定义的模版定制不同的逻辑页面需求

## 使用方法
### 直接运行
```sh
npm run img-build-1 
```
在dist输出`img-build.html`文件

### 支持参数
```json
  "scripts": { 
    "img-build-1": "node ./src/util/generateImgContent.js  --ejs_path=./img-template-1.ejs --imgPath=static/images/products/product1/pc/*  --cdn=http://cdn/", 
    "img-build-2": "node ./src/util/generateImgContent.js  --ejs_path=./img-template-2.ejs --imgPath=static/images/products/product1/mobile/*  --cdn=../static/images/products/product1/mobile/" 
  }, 
```
```js
- ejs_path : "./img-template-1.ejs"; //这里为对应要输出的模板 
- imgPath : "static/images/products/product1/pc/*"; //这里为遍历的图片文件夹路径
- cdn : "http://cdn/"; //这里替换为实际的业务地址, 本地调试可以使用相对地址 ../static/images/products/product1/mobile/
```

### 模版文件
img-template-1.ejs
```html
<div class="floor-container">
  <h1>pc</h1>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <!-- 这里根据实际的情况 修改对应的模板内容 -->
      <% lists.forEach(function(file){%><div class="swiper-wrapper"><div class="swiper-slide">
            <img src="../static/images/products/product1/pc/<%= file.fileNameAndExt %>" alt="<%= file.fileName %>" title="<%= file.fileName %>">
            <p>"<%= file.fileName %>"</p>
        </div> 
      </div>
      <% })%>
    </div>
  </div>
  <div class="swiper-button-prev"></div> 
  <div class="swiper-button-next"></div> 
</div>  
```


img-template-2.ejs
```html
<div class="floor-container">
  <div class="row">
      <p class="title animation-item animation">mobile </p>
      <div class="product-text">  
        <% lists.forEach(function(file){%><img src="<%= file.cdn %><%= file.fileNameAndExt %>" alt="<%= file.fileName %>">
          <% })%>
      </div>
      <div class="product-img pc"> 
        <% lists.forEach(function(file){%><img src="<%= file.cdn %><%= file.fileNameAndExt %>" alt="<%= file.fileName %>"> 
        <% })%>
      </div>
      <div class="product-img mobile">
        <% lists.forEach(function(file){%><img src="<%= file.cdn %><%= file.fileNameAndExt %>" alt="<%= file.fileName %>"> 
        <% })%>
      </div>
      <div class="product-icon"> 
        <% lists.forEach(function(file){%><img src="<%= file.cdn %><%= file.fileNameAndExt %>" alt="<%= file.fileName %>">
        <% })%>
      </div>
  </div>
</div>
```

### 主要逻辑代码
generateImgContent.js
```js
// 动态根据图片资源生成图片以及标签内容 包括 alt src 地址， title 名称
"use strict";
const glob = require("glob");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

let imgTemplatePath = require('minimist')(process.argv.slice(2))['ejs_path']  //"./img-template-1.ejs"; //这里为对应要输出的模板 
let imgPath =require('minimist')(process.argv.slice(3))['imgPath']  // "static/images/products/product1/pc/*"; //这里为遍历的图片文件夹路径
let cdn =require('minimist')(process.argv.slice(4))['cdn']  // "http://cdn/"; //这里替换为实际的业务地址, 本地调试可以使用相对地址 ../static/images/products/product1/mobile/
console.log("imgTemplatePath",imgTemplatePath)
console.log("imgPath",imgPath)
console.log("cdn",cdn)  

const entryFiles = glob.sync(
  imgPath 
);

console.log("entryFiles", entryFiles);

// 写入文件夹操作
const writeToFile = (pathName, result) => {
  //先判断文件夹是否存在，不存在则创建
  const dirname = path.dirname(pathName);
  if(!fs.existsSync(dirname)){
      fs.mkdirSync(dirname);
  }
  // path: 目标文件夹的绝对路径（只支持绝对路径）
  return fs.promises.writeFile(pathName, result);
};

const getCompilerTxt = async (templateName, lists) => {
  // 根据用户执行的命令，拿到指定路径的模板，进行渲染创建
  const templateCurrentPath = `./${templateName}`;
  const templateAbsolutePath = path.resolve(__dirname, templateCurrentPath);
  // 读取HTML 标签
  return new Promise((resolve, reject) => {
    ejs.renderFile(templateAbsolutePath, { lists }, {}, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

let outerList = [];
Object.keys(entryFiles).map(async (index) => {
  const entryFile = entryFiles[index];
  const fileInfo = path.parse(entryFile);
  let fileName = fileInfo.name;
  fileName = fileName.replaceAll("-", " ");
  const fileNameAndExt = fileInfo.base;   
  let file = {
    fileNameAndExt,
    fileName,
    cdn,
  };
  outerList.push(file);
}); 
async function run() {
  let html = await getCompilerTxt(imgTemplatePath, outerList);  
    const targetPath = path.resolve("./dist", `img-build.html`); 
    await writeToFile(targetPath, html); 
}
run();

```