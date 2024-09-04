
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config(); // 加载环境变量

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ error: 'Forbidden', message: '无权限' });
      }
      next();
  };
}

  module.exports = authorizeRole;