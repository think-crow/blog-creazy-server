const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersModel = require('../../models/UsersModel'); // 确保正确导入用户模型
const { validationResult } = require('express-validator');
const authenticateToken = require('../../middlewares/authenticateToken');
// 处理用户注册的路由
router.post('/register', async (req, res) => {
    // 验证请求体数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // 检查用户名是否已存在
        const existingUser = await UsersModel.findOne({ username });
        if (existingUser) {
            // console.log('JWT_SECRET:', process.env.JWT_SECRET);
            return res.status(400).json({ message: '用户名已被注册' });
        }
        // console.log('JWT_SECRET:', process.env.JWT_SECRET);
        // 对密码进行哈希处理
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 创建新用户并保存到数据库
        const newUser = new UsersModel({ username, passwordHash: hashedPassword });
        await newUser.save();
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        // 生成 JWT 令牌
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 返回令牌给客户端
        res.json({ token });
    } catch (error) {
        console.error('注册出错:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

module.exports = router;
