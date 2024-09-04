const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
let myPath = path.resolve(__dirname, '../../public/file/links.json');
const authenticateToken = require('../../middlewares/authenticateToken');
const authorizeRole = require('../../middlewares/authorizeRole'); // 用户权限
// 定义路由来读取文件数据并发送给前端
// 定义路由来读取文件数据并发送给前端
router.get('/links', (req, res) => {
  // 读取文件中的链接数据
  fs.readFile(myPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件出错:', err);
      return res.status(500).json({ error: '读取文件出错' }); // 返回简单的错误消息
    }

    try {
      const links = JSON.parse(data); // 假设文件中存储的是 JSON 格式的链接数据
      res.json(links); // 将链接数据发送给前端
    } catch (error) {
      console.error('解析 JSON 数据出错:', error);
      res.status(500).json({ error: '解析 JSON 数据出错' });
    }
  });
});

// let mytoPath = path.resolve(__dirname, '../../public/file/tolinks.json');
router.get('/tolinks', (req, res) => {
  // 读取文件中的链接数据
  // fs.readFile(mytoPath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('读取文件出错:', err);
  //     return res.status(500).json({ error: '读取文件出错' }); // 返回简单的错误消息
  //   }

    try {
      // const links = JSON.parse(data); // 假设文件中存储的是 JSON 格式的链接数据
      res.json("老铁，有潜力！"); // 将链接数据发送给前端
    } catch (error) {
      console.error('解析 JSON 数据出错:', error);
      res.status(500).json({ error: '解析 JSON 数据出错' });
    }

});


module.exports = router;
