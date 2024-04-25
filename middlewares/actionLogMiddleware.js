const request = require("request");
const UAParser = require("ua-parser-js");
const VisitorsModel = require('../models/VisitorsModel');

// IP地址解析
function parseIP(clientIp) {
    return new Promise((resolve, reject) => {
        request(
            `https://opendata.baidu.com/api.php?query=[${clientIp}]&co=&resource_id=6006&oe=utf8`,
            {method: 'GET'},
            function (error, response, body) {
                if (error !== null) {
                    reject(error);
                    return;
                }
                if (body && !body.status) {
                    resolve(body.length && JSON.parse(body).data[0].location || '-');
                }
            }
        );
    });
}

// 获取公共IP地址
function getPublicIP(req) {
    const { headers } = req;
    if (headers['x-real-ip']) {
        return headers['x-real-ip'];
    }
    if (headers['x-forwarded-for']) {
        const ipList = headers['x-forwarded-for'].split(',');
        return ipList[0];
    }
    return '0.0.0.0';
}


/**
 * 创建访客记录
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 */
const visitorsCreate = [
    async (req, res, next) => {
        try {
            const clientIP = getPublicIP(req);
            //识别常见的浏览器、操作系统和设备等信息
            const u = new UAParser(req.headers['user-agent']);
            const address = await parseIP(clientIP);
            const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知'
            const today = new Date().toISOString().split('T')[0]; // 获取今天的日期

            const existingVisitor = await VisitorsModel.findOne({
               
                ip: clientIP,
                type: req.body.type || 'client',
                browser: equipment,
                address,
                createdAt: {$gte: new Date(today)}, // 在今天之内的记录
            });

            if (existingVisitor) {
                // 如果今天已经记录过这个访客信息，则只更新浏览次数
                await VisitorsModel.findByIdAndUpdate(existingVisitor._id, {$inc: {viewNum: 1}});
                next();
            } else {
                // 否则，创建新的访客记录
                const newVisitors = {
            
           
                    address,
                    ip: clientIP,
                    browser: equipment,
                    viewNum: 1, // 初始化浏览次数为1
                };
                const createdVisitor = await VisitorsModel.create(newVisitors);
                next();
            }
        } catch (err) {
            next(err);
        }
    }
];


module.exports = visitorsCreate;
