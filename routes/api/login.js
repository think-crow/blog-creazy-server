const express = require('express');
const router = express.Router();
const path = require('path');
const UsersModel = require('../../models/UsersModel');
const authenticateToken = require('../../middlewares/authenticateToken');
const authorizeRole = require('../../middlewares/authorizeRole'); // 用户权限

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 处理用户登录的路由
router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    // console.log(req.body);
  
    try {
      // 检查用户是否存在于数据库中
      const user = await UsersModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: '用户未找到' });
      }
  // console.log(user);
      // 检查密码是否正确
      if (!await bcrypt.compare(password, user.passwordHash)) {
        return res.status(401).json({ message: '密码错误' });
      }
      // console.log('JWT_SECRET:', process.env.JWT_SECRET);
      // 如果凭据有效，生成JWT
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // 返回JWT给客户端
      res.json({ token });
  
    } catch (error) {
      console.error('登录出错:', error);
      res.status(500).json({ message: '服务器内部错误' });
    }
  });
  
  // 示例的受保护路由，需要认证
  router.get('/userinfo', authenticateToken,authorizeRole(['admin']), (req, res) => {
    // 此处可进行授权逻辑，例如从数据库获取用户信息
    res.json({ message: '您已访问受保护信息！' });
  });
  

  // 用于验证JWT的中间件函数
  // function authenticateToken(req, res, next) {
  //   const authHeader = req.headers['authorization'];
  //   const token = authHeader && authHeader.split(' ')[1];
  //   if (!token) {
  //     return res.status(401).json({ message: '未授权' });
  //   }
  
  //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //     if (err) {
  //       return res.status(403).json({ message: '禁止访问' });
  //     }
  //     req.user = user;
  //     next();
  //   });
  // }

module.exports = router;
