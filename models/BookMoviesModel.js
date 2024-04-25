const mongoose = require('mongoose');

const BookMoviesSchema = new mongoose.Schema({
   _id:{
      type:String,
     },
   category:{
    type:String,
   },
   title:{
      type:String,
     },
     img_path:{
      type:String,
     },
     summary:{
      type:String,
     },

     myreflections:{
      type:String,
     },
     submi_date:{
      type:Number,
     }
     
});

const BookMoviesModel = mongoose.model('book_movies',BookMoviesSchema);

// 暴漏模型对象
module.exports = BookMoviesModel;