const mongoose = require('mongoose');

const PoetrySchema = new mongoose.Schema({
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

     annotation:{
      type:String,
     },
     submi_date:{
      type:Number,
     }
     
});

const PoetryModel = mongoose.model('poetrys',PoetrySchema);

// 暴漏模型对象
module.exports = PoetryModel;