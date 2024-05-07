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
