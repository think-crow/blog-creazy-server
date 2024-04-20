const mongoose = require('mongoose');

const TopicsSchema = new mongoose.Schema({

   title:{
      type:String,
     },

     content:{
      type:String,
     },
     submi_date:{
      type:Number,
     }
     
});

const TopicsModel = mongoose.model('topics',TopicsSchema);

// 暴漏模型对象
module.exports = TopicsModel;