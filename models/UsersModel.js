//定义了用户模式（Schema）和相应的模型（Model），用户模式包括用户名和加密后的密码哈希值，用户名是唯一且必需的。
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
  
});

const UsersModel = mongoose.model('users',UsersSchema);

// 暴漏模型对象
module.exports = UsersModel;