const express = require('express');
const router = express.Router();
const path = require('path');
const TopicsModel = require('../../models/TopicsModel');
const authenticateToken = require('../../middlewares/authenticateToken');
const authorizeRole = require('../../middlewares/authorizeRole'); // 用户权限

/* 话题请求-数据接口 */
router.get('/topics_data',async function(req, res, next) {
   let page = parseInt(req.query.page) || 1; // 默认页码为 1
   let limit = parseInt(req.query.limit) || 8; // 默认每页条数为 10
   const category  = req.query.category || "all"; // 获取名为 category 的查询参数，如果前端未提供该参数，则默认值为 "all"。
   const query = category !== "all" ? { category: category } : {}; // 根据前端传递的 category 值决定要构建的查询条件。如果 category 不是 "all"，则构建一个包含指定 category 值的查询条件，否则构建一个空的查询条件。

   const total = await TopicsModel.countDocuments({query, visible: true});
        if (page > total) page = 1;
        if (limit > total) limit = total;
        await TopicsModel.find({query, visible: true}).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).then((result)=>{  
            res.json({total,page,limit,result});
  }).catch((err)=>{
  res.status(502).send('请求数据库失败');
  });
})

// 后台请求书影数据
router.get('/topics_alldata',authenticateToken,authorizeRole(['admin']), async function(req, res, next) {
  const category  = req.query.category || "all"; 
  const query = category !== "all" ? { category: category } : {}; 
  //   try {
  //   const result = await TopicsModel.updateMany({}, { $set: { visible: true } });
  //   console.log("数据迁移成功");
  // } catch (err) {
  //   console.error("迁移数据失败：" + err);
  // }
  // Object.assign(query, { visible: true });
  if (req.query._id) {
    // 如果存在 ID 参数，则查询单条数据
    await TopicsModel.findById(req.query._id).then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).send('未找到对应的数据');
      }
    }).catch((err) => {
      res.status(500).send('请求数据库失败');
    });
  }else{
    
  await TopicsModel.find(query).sort({ _id: -1 }).then((result)=>{  
    res.json(result);
 }).catch((err)=>{
 res.status(501).send('请求数据库失败');
 });
 }
})

// 删除一条
router.delete('/deleteone_topics/:_id',authenticateToken,authorizeRole(['admin']), async function(req, res, next) {
  const _id = req.params._id; 
  await TopicsModel.deleteOne({_id:_id}).then((result)=>{  
    res.json(result);
 }).catch((err)=>{
 res.status(501).json({ error: '删除数据时出错' });
 });
})

// 更新一条数据
// 定义 PATCH 路由用于更新数据
router.patch('/topics_updata_one',authenticateToken, authorizeRole(['admin']),async (req, res) => {
  try {
    // console.log(req.body);
    // 使用 Mongoose 更新文档数据
    const result = await TopicsModel.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error123: '更新失败' });
  }
});

// 添加一条数据
router.post('/topics',authenticateToken,authorizeRole(['admin']), (req, res) => {
const currentTime = Date.now();
// console.log({...req.body});
// res.send("恭喜你，添加成功，我是小小");
TopicsModel.create({
        ...req.body,
   submi_date:currentTime,

  }).then((result)=>{
      //成功提醒
      res.send("恭喜你，添加成功，我是小小");
 
  }).catch((err)=>{
    res.status(501).send('添加数据库失败');
  });
});


module.exports = router;
