# 本仓库存放为作者第一代博客后台代码，采用node编写。
注：他不是程序员，只是想有一个网站，追求只要能跑就行，所以有点东拼西凑，不太安全，不建议借鉴。

### 原则上是不上传node_module的，直接运行npm i即可安装依赖，但不太放心这些库的存世时时长，就上传上去了，希望在未来的某一天想运行一下看看，也能运行的起来！
Node.js v20.11.1
db version v7.0.7

运行方式：
确保已经安装node和mongodb，配置好环境变量，并执行命令mongod 启动数据库。
1、clone仓库
2、npm i 安装依赖
3、npm start 运行后台

- 原数据库名称：creazy_blog_database
- 需要增加一个环境变量供注册用户使用：（忘记在哪看的把一些数据放到环境变量中，更安全一些，就研究了一下）
    变量名：JWT_SECRET
    变量值：your_secret_key_here
注意导入mongodb数据时注意_id类型。

前端界面：https://github.com/think-crow/blog-creazy
后台界面：https://github.com/think-crow/blog-creazy-admin
