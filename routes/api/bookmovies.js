const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs")
const authenticateToken = require('../../middlewares/authenticateToken');
// 处理文件上传
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }); // 设置文件上传目录
const BookMoviesModel = require('../../models/BookMoviesModel');

/* 书影数据接口 */
router.get('/bookmovies_data',async function(req, res, next) {
   let page = parseInt(req.query.page) || 1; // 默认页码为 1
   const limit = parseInt(req.query.limit) || 1; // 默认每页条数为 10
   const category  = req.query.category || "all"; // 获取名为 category 的查询参数，如果前端未提供该参数，则默认值为 "all"。
   const query = category !== "all" ? { category: category } : {}; // 根据前端传递的 category 值决定要构建的查询条件。如果 category 不是 "all"，则构建一个包含指定 category 值的查询条件，否则构建一个空的查询条件。

   const total = await BookMoviesModel.countDocuments(query);
        if (page > total) page = 1;
                 await BookMoviesModel.find(query).sort({ submi_date: -1 }).skip((page - 1) * limit).limit(limit).then((result)=>{  
                 res.json({total,page,limit,result});
  }).catch((err)=>{
  res.status(502).send('请求数据库失败');
  });
})

// 后台请求书影数据
router.get('/bookmovies_alldata',authenticateToken, async function(req, res, next) {
  const category  = req.query.category || "all"; 
  const query = category !== "all" ? { category: category } : {}; 

  if (req.query._id) {
    // 如果存在 ID 参数，则查询单条数据
    await BookMoviesModel.findById(req.query._id).then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).send('未找到对应的数据');
      }
    }).catch((err) => {
      res.status(500).send('请求数据库失败');
    });
  }else{
    
  await BookMoviesModel.find(query).sort({ _id: -1 }).then((result)=>{  
    res.json(result);
 }).catch((err)=>{
 res.status(501).send('请求数据库失败');
 });
 }
})

// 更新一条数据
// 定义 PATCH 路由用于更新数据
router.patch('/updata_one',authenticateToken, upload.single('img_file'),async (req, res) => {
  try {

    const _id = req.query._id;
    // const updatedData = req.body; // 前端传递过来的更新数据
    
    const updatedData = {
      category : req.body.category,
      title : req.body.title,
   
      summary : req.body.summary,
      myreflections : req.body.myreflections,
      // 其他需要更新的字段
    };
        // 检查是否有新上传的文件，若有则更新图片路径  并获取旧图片路径，并删除旧图片
        if (req.file) {
          const oldData = await BookMoviesModel.findById(_id);
          const old_img_path = oldData.img_path;
          const new_img_path = req.file.path.slice(7);
          updatedData.img_path = new_img_path; // 更新图片字段

                // 删除旧图片
      if (old_img_path) {
        fs.unlinkSync(path.join('public', old_img_path));
        }}

    // 使用 Mongoose 更新文档数据
    const result = await BookMoviesModel.findByIdAndUpdate(_id, updatedData, { new: true });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error123: '更新失败' });
  }
});


// 删除一条
router.delete('/deleteone_bookmovies/:_id',authenticateToken, async function(req, res, next) {
  const _id = req.params._id; 
  await BookMoviesModel.deleteOne({_id:_id}).then((result)=>{  
    res.json(result);
 }).catch((err)=>{
 res.status(501).json({ error: '删除数据时出错' });
 });
})



// 添加一条数据
router.post('/book_movies',authenticateToken, upload.single('img_file'), (req, res) => {
  //插入数据库
  // console.log(req.file.path);

const currentTime = Date.now();
const new_img_path = req.file.path.slice(7);
BookMoviesModel.create({
   category : req.body.category,
   title : req.body.title,
   img_path : new_img_path,
   summary : req.body.summary,
   myreflections : req.body.myreflections,
   submi_date:currentTime,

  }).then((result)=>{
      //成功提醒
      res.send("恭喜你，添加成功，我是小小");
 
  }).catch((err)=>{
    res.status(501).send('添加数据库失败');
  });
});


module.exports = router;
