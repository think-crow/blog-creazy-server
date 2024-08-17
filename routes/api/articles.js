const express = require('express');
const router = express.Router();
const path = require('path');
const ArticleModel = require('../../models/ArticleModel');
const authenticateToken = require('../../middlewares/authenticateToken'); // 根据实际文件路径调整

router.get('/article_data', async function(req, res, next) {
  // 为所有文章添加visible字段
  // try {
  //   const result = await ArticleModel.updateMany({}, { $set: { visible: true } });
  //   console.log("数据迁移成功");
  // } catch (err) {
  //   console.error("迁移数据失败：" + err);
  // }
  // Object.assign(query, { visible: true });
  try {
    // console.log(req.query);
    if (req.query._id) {
      // 如果存在 ID 参数，则查询单条数据
      const result = await ArticleModel.findById(req.query._id).exec();
      // console.log(result);
      if (result) {
        let prevArticle = null;
        let nextArticle = null;
        const query = req.query.category !== "all" ? { category: req.query.category } : {};
          const prev = await ArticleModel.findOne({ _id: { $lt: req.query._id },...query ,visible: true}, { title: 1 }).sort({ _id: -1 }).exec();
          if (prev) {
            prevArticle = prev;
          }
          const next = await ArticleModel.findOne({ _id: { $gt: req.query._id },...query,visible: true }, { title: 1 }).sort({ _id: 1 }).exec();
          if (next) {
            nextArticle = next;
          }
        res.json({result, prevArticle, nextArticle});
      } else {
        res.status(404).send('404了未找到对应的数据');
      }
    } else {
      const category = req.query.category || "all";
      // const query = category !== "all" ? { category: category } : {category:{$ne: "reference_2"}};
         const query = category !== "all" ? { category: category } : {};
      // 否则查询所有数据
      const results = await ArticleModel.find({ ...query, visible: true }, { title: 1, submi_date: 1 }).sort({ _id: -1 }).exec();
      res.json( results ); 
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('请求数据库失败');
  }
});


//后台查询所有数据
router.get('/article_alldata',authenticateToken, async function(req, res, next) {

  try {
    // console.log(req.query);
    if (req.query._id) {
      // 如果存在 ID 参数，则查询单条数据
      const result = await ArticleModel.findById(req.query._id).exec();
      // console.log(result);
      res.json( result ); 
    } else {
      const category = req.query.category || "all";
      // const query = category !== "all" ? { category: category } : {category:{$ne: "reference_2"}};
         const query = category !== "all" ? { category: category } : {};
      // 否则查询所有数据
      const results = await ArticleModel.find(query, { title: 1, submi_date: 1, visible:1 }).sort({ _id: -1 }).exec();
      res.json( results ); 
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('请求数据库失败');
  }
});

// 删除一条
router.delete('/deleteone_article/:_id',authenticateToken, async function(req, res, next) {
  const _id = req.params._id;
  try {
      // 查询被删除的文章的标题和日期
      const deletedArticle = await ArticleModel.findOneAndDelete({ _id: _id }).select({ title: 1, submi_date: 1 }).exec();
      if (!deletedArticle) {
          return res.status(404).json({ error: '未找到要删除的文章' });
      }
      // 返回被删除的文章的标题和日期
      res.json(deletedArticle);
  } catch (err) {
      console.error(err);
      res.status(501).json({ error: '删除数据时出错' });
  }
});
// 更新一条数据
router.patch('/article_updata_one',authenticateToken, async (req, res) => {
  try {
   
      // console.log(req);
      // 使用 Mongoose 更新文档数据，并选择只返回标题和日期
      const result = await ArticleModel.findByIdAndUpdate(req.body._id, req.body, { new: true }).select({ title: 1, submi_date: 1 }).exec();
      if (!result) {
          return res.status(404).json({ error: '未找到要更新的文章' });
      }
      // 返回被更新的文章的标题和日期
      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: '更新失败' });
  }
});


// 添加一条数据
router.post('/article',authenticateToken, (req, res) => {
const currentTime = Date.now();
ArticleModel.create({
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
