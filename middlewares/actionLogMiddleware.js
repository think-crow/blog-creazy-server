const request = require("request");
const UAParser = require("ua-parser-js");
const VisitorsModel = require('../models/VisitorsModel');
const geoip = require('geoip-lite');

// IP地址解析

function parseIP(clientIp) {
    return new Promise((resolve, reject) => {
        request(
            `https://opendata.baidu.com/api.php?query=${encodeURIComponent(clientIp)}&co=&resource_id=6006&oe=utf8`,
            { method: 'GET' },
            function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }

                try {
                    const parsedBody = JSON.parse(body);
                    if (parsedBody.status !== '0') { // 确保响应状态是 '0'，表示没有错误
                        reject(new Error('Failed to fetch location'));
                        return;
                    }
                    // console.log(parsedBody);
                    // 从响应中安全地提取 location
                    const location = parsedBody.data && parsedBody.data[0] && parsedBody.data[0].location ? parsedBody.data[0].location : '-';
                  
                    resolve(location);
                } catch (e) {
                    reject(e);
                }
            }
        );
    });}

// 获取公共IP地址
function getPublicIP(req) {
    // console.log(req.headers);
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
        // console.log(req.headers['user-agent']);
        try {
            const clientIP = getPublicIP(req);
            //识别常见的浏览器、操作系统和设备等信息
            const u = new UAParser(req.headers['user-agent']);
  


            const location = geoip.lookup(clientIP);
// console.log(location);
            const address = await parseIP(clientIP);
            const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知';
            const today = new Date().toISOString().split('T')[0]; // 获取今天的日期
            const today1 = new Date() 
            // console.log(today1);
            const filter = {
                ip: clientIP,
                browser: equipment,
                address,
                createdAt: { $gte: new Date(today) } // 在今天之内的记录
            };

            const update = { $inc: { viewNum: 1 } };
            const options = { new: true, upsert: true }; // 如果不存在则创建新记录

            const updatedVisitor = await VisitorsModel.findOneAndUpdate(filter, update, options);
            // console.log(updatedVisitor);

            next();
        } catch (err) {
            next(err);
        }
    }
];


module.exports = visitorsCreate;
