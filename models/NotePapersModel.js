const mongoose = require('mongoose');

const NotePapersSchema = new mongoose.Schema({
     _id:{
          type:String,
         },
     content:{
      type:String,
     },
     submi_date:{
      type:Number,
     }
     
});

const NotePapersModel = mongoose.model('notepapers',NotePapersSchema);

// 暴漏模型对象
module.exports = NotePapersModel;