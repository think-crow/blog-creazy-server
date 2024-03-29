var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/web/index');
var suggestsRouter = require('./routes/api/suggests');
var bookmoviesRouter = require('./routes/api/bookmovies');

const fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 解决跨域
const corsOptions = {
  origin:['http://127.0.0.1:3001','http://localhost:5173'],
  credentails:true,
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'uploads')));

// 防盗链
app.use((req,res,next)=>{
  // console.log('Middleware triggered');
  let referer = req.get('referer');
// console.log(referer);
  if(referer){
    let url = new URL(referer);
    // console.log(url);
    let hostname = url.hostname;

    if(hostname !== '127.0.0.1' && hostname !== 'localhost'){
      res.status(404).send(`<h1>Not Fond  hahaha</h1>`)
    }
  }
  next();
});
var useragent = require('express-useragent');
app.use(useragent.express());
// 记录访问者信息
function recordMiddleware(req,res,next){
  const currentTime = new Date().toLocaleString();
  let {url,ip} =req;
  let {browser, os } = req.useragent;
  fs.appendFileSync(path.resolve(__dirname, './access.log'), `访问路径:${url} IP:${ip} 浏览器:${browser} 操作系统:${os} 时间:${currentTime}\r\n`);

  next();
};

// 记录

// app.get('/', function(req, res){
//   console.log(req.useragent);只记录浏览器 系统信息
// });


app.use(recordMiddleware);
app.use('/', indexRouter);
app.use('/api', suggestsRouter);
app.use('/api', bookmoviesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// 解决跨域

//防盗链(...找了半天错，防盗链要放在路由之前，给放上面了)



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});






module.exports = app;
