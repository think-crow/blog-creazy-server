var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

var indexRouter = require('./routes/web/index');
var suggestsRouter = require('./routes/api/suggests');
var bookmoviesRouter = require('./routes/api/bookmovies');
var poetrysRouter = require('./routes/api/poetrys');
var topicsRouter = require('./routes/api/topics');
var notepapersRouter = require('./routes/api/notepapers');
var discoverRouter = require('./routes/api/discover');
var articlesRouter = require('./routes/api/articles');

const fs = require('fs');

var app = express();

// 限制频繁请求
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 限制时间窗口为15分钟
  max: 200, // 在限制时间窗口内允许的最大请求数
  message: '请求过于频繁，请稍后再试。'
});
// 应用限制中间件到所有的请求
app.use(limiter);

// 设置静态文件夹
app.set('views', path.join(__dirname, 'views'));
// 解决跨域
// const corsOptions = {
//   origin:['http://127.0.0.1:3001','http://localhost:5173','http://localhost:3001','http://192.168.1.153','http://192.168.1.107:3001'],
//   credentails:true,
// };
// app.use(cors(corsOptions));
app.use(cors());

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'uploads')));

// 防盗链
// app.use((req,res,next)=>{
//   // console.log('Middleware triggered');
//   let referer = req.get('referer');
// // console.log(referer);
//   if(referer){
//     let url = new URL(referer);
//     // console.log(url);
//     let hostname = url.hostname;

//     if(hostname !== '127.0.0.1' && hostname !== 'localhost'){
//       res.status(404).send(`<h1>Not Fond  hahaha</h1>`)
//     }
//   }
//   next();
// });
var visitorsCreate = require('./middlewares/actionLogMiddleware');
app.use(visitorsCreate);

var useragent = require('express-useragent');
app.use(useragent.express());
// 记录访问者信息   ipinfo可以解析ip归属地
function recordMiddleware(req,res,next){
  const currentTime = new Date().toLocaleString();
  let {url} =req;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let {browser, os } = req.useragent;
  fs.appendFileSync(path.resolve(__dirname, './access.log'), `访问路径:${url} IP:${clientIP} 浏览器:${browser} 操作系统:${os} 时间:${currentTime}\r\n`);

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
app.use('/api', poetrysRouter);
app.use('/api', topicsRouter);
app.use('/api', notepapersRouter);
app.use('/api', discoverRouter);
app.use('/api', articlesRouter);



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
