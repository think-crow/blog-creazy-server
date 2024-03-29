const mongoose = require('mongoose');

const SuggestSchema = new mongoose.Schema({
   jianyi:{
    type:String,
   },
   submi_date:{
      type:String,
     }
});

const SuggestModel = mongoose.model('suggests',SuggestSchema);

// 暴漏模型对象
module.exports = SuggestModel;