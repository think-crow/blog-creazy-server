const express = require('express');
const router = express.Router();
const path = require('path');
const VisitorsModel = require('../../models/VisitorsModel');
const authenticateToken = require('../../middlewares/authenticateToken');



// // 请求IP访问数据
router.get('/ip_alldata', authenticateToken, async function(req, res, next) {
  try {
    const result = await VisitorsModel.find().sort({ _id: -1 }).select({ _id: 0, __v: 0 });
    res.json(result);
  } catch (err) {
    res.status(501).send('请求数据库失败');
  }
});


// // 更新一条数据
// // 定义 PATCH 路由用于更新数据
router.patch('/ip_updata_all',async (req, res) => {
  try {
    const result = await VisitorsModel.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error123: '更新失败' });
  }
});



module.exports = router;
