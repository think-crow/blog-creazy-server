
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config(); // 加载环境变量

  // 用于验证JWT的中间件函数
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(403).json({ message: '未授权' });
    }
    // console.log(process.env.JWT_SECRET);
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Unauthorized', message: 'token过期了,请重新登录' });
      }
      return res.status(403).json({ error: 'Forbidden', message: '未授权' });
    }
  }


  module.exports = authenticateToken;