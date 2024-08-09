const mongoose = require('mongoose')
let schema = new mongoose.Schema({
    name: {
        type: String,
        comment: '联系方式'
    },
    email: {
        type: String,
        comment: '邮箱'
    },
    message: {
        type: String,
        comment: '留言'
    },



}, {
    timestamps: true,
  
});

// module.exports = mongoose.model('visitors', schema);
const ContactsModel = mongoose.model('contacts', schema);

// 暴漏模型对象
module.exports = ContactsModel;
