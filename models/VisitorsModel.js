const mongoose = require('mongoose')
let schema = new mongoose.Schema({
    _id:{
        type:String,
       },
    ip: {
        type: String,
        comment: '访问IP'
    },
    browser: {
        type: String,
        comment: '设备'
    },
    address: {
        type: String,
        comment: '访问来源'
    },

    viewNum: {
        type: Number,
        comment: '访问次数'
    },


}, {
    timestamps: true,
  
});

// module.exports = mongoose.model('visitors', schema);
const VisitorsModel = mongoose.model('visitors', schema);

// 暴漏模型对象
module.exports = VisitorsModel;
