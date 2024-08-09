var express = require('express');
var router = express.Router();

const SuggestModel = require('../../models/SuggestModel');
const authenticateToken = require('../../middlewares/authenticateToken');
/* GET home page. */
router.get('/suggests_data',authenticateToken, async function(req, res, next) {
  await SuggestModel.find().then((result)=>{
    //成功提醒
    res.json(result);

  
  }).catch((err)=>{
  res.status(501).send('请求建议失败');
  });

})

router.post('/suggests',async (req, res) => {
  //插入数据库
// console.log(req.body);
const currentTime = Date.now();

  await SuggestModel.create({
    ...req.body,
    submi_date:currentTime

  }).then((result)=>{
      //成功提醒
      res.send('success');
   
  }).catch((err)=>{
    res.status(501).send('shibai');
  });
});


module.exports = router;
