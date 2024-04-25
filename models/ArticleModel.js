const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
   _id:{
      type:String,
     },
   category:{
    type:String,
   },
   title:{
      type:String,
     },
     author:{
      type:String,
     },
     content:{
      type:String,
     },
     submi_date:{
      type:Number,
     }
     
});

const ArticleModel = mongoose.model('articles',ArticleSchema);

// 暴漏模型对象
module.exports = ArticleModel;