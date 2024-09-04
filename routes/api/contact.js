const express = require('express');
const router = express.Router();
const path = require('path');
const ContactsModel = require('../../models/Contact');
const authenticateToken = require('../../middlewares/authenticateToken');
const authorizeRole = require('../../middlewares/authorizeRole'); // 用户权限


// // 更新提交数据
router.post('/contact', async function(req, res, next) {
  try {
    // 假设你的 req.body 包含了需要更新的数据
    const { name, email, message } = req.body;

    // 检查必填字段
    if (!name || !email || !message) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 假设你希望通过某个条件来查找和更新文档，比如根据 email 地址
    const filter = { email: email };
    
    // 设置更新的字段和选项
    const update = { name: name, message: message };
    const options = { new: true, upsert: true }; // new: true 返回更新后的文档，upsert: true 如果文档不存在则创建

    // 执行更新操作
    const updatedVisitor = await ContactsModel.findOneAndUpdate(filter, update, options);

    // 如果需要在更新成功后做一些额外的操作，可以在这里添加代码

    // 发送成功消息
    res.status(200).send({ message: '提交成功', data: updatedVisitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '更新失败' });
  }
});

//后台查询所有数据
router.get('/contact-data',authenticateToken, authorizeRole(['user', 'admin']), async function(req, res, next) {

  try {
      const results = await ContactsModel.find().sort({ _id: -1 }).exec();
      res.json( results ); 
  } catch (err) {
    console.error(err);
    res.status(500).send('请求数据库失败');
  }
});



router.delete('/deleteone-contact/:_id',authenticateToken, authorizeRole(['user', 'admin']), async function(req, res, next) {
  const _id = req.params._id;
  // console.log(_id);
  try {
    const result = await ContactsModel.deleteOne({ _id: _id });
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.error('删除数据时出错:', err);
    res.status(501).json({ error: '删除数据时出错' });
  }
});

module.exports = router;