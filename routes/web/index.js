var express = require('express');
var router = express.Router();

// const SuggestModel = require('../../models/SuggestModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index');
});




module.exports = router;
