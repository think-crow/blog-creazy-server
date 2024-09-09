const request = require("request");
const UAParser = require("ua-parser-js");
const VisitorsModel = require('../models/VisitorsModel');
const geoip = require('geoip-lite');

// IP地址解析

// function parseIP(clientIp) {
//     return new Promise((resolve, reject) => {
//         request(
//             `https://opendata.baidu.com/api.php?query=${encodeURIComponent(clientIp)}&co=&resource_id=6006&oe=utf8`,
//             { method: 'GET' },
//             function (error, response, body) {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }

//                 try {
//                     const parsedBody = JSON.parse(body);
//                     if (parsedBody.status !== '0') { // 确保响应状态是 '0'，表示没有错误
//                         reject(new Error('Failed to fetch location'));
//                         return;
//                     }
//                     console.log(parsedBody);
//                     // 从响应中安全地提取 location
//                     const location = parsedBody.data && parsedBody.data[0] && parsedBody.data[0].location ? parsedBody.data[0].location : '-';
                  
//                     resolve(location);
//                 } catch (e) {
//                     reject(e);
//                 }
//             }
//         );
//     });}
// I3NBZ-VX6ET-ESKXQ-LUF4H-MKBC6-KNF3J

// 缓存 IP 地址解析结果及其过期时间
const ipCache = new Map();
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1小时

function setCache(key, value) {
    ipCache.set(key, { value, timestamp: Date.now() });
}

function getCache(key) {
    const cached = ipCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY_MS) {
        return cached.value;
    }
    ipCache.delete(key);
    return null;
}

function parseIP(clientIp) {
    return new Promise((resolve, reject) => {
        const apiKey = 'I3NBZ-VX6ET-ESKXQ-LUF4H-MKBC6-KNF3J'; // 使用你的实际密钥
        const ipAddress = encodeURIComponent(clientIp); // 如果不需要指定 IP，可以将其删除
        
        const url = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ipAddress}&key=${apiKey}`;
        
        const cachedResult = getCache(clientIp);
        if (cachedResult) {
            resolve(cachedResult);
            return;
        }

        request(
            url,
            { method: 'GET' },
            function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }

                try {
                    const parsedBody = JSON.parse(body);
                    if (parsedBody.status !== 0) { // 确保响应状态是 '0'，表示没有错误
                        console.error('API error:', parsedBody.message);
                        reject(new Error('Failed to fetch location'));
                        return;
                    }

                    const location = parsedBody.result?.location;
                    const adInfo = parsedBody.result?.ad_info;

                    const result = [
                        adInfo?.nation,
                        adInfo?.province,
                        adInfo?.city,
                        adInfo?.district,
                        `Lat ${location?.lat || 'N/A'}, Lng ${location?.lng || 'N/A'}`
                    ].filter(Boolean).join(' ');

                    setCache(clientIp, result);
                    resolve(result);
                } catch (e) {
                    reject(e);
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
        if (req.path === '/contact' || req.path === '/contact-data') {
            return next(); // 跳过记录
        }

        try {
            const clientIP = getPublicIP(req);
            const u = new UAParser(req.headers['user-agent']);
            const address = await parseIP(clientIP).catch(error => {
                console.error('Failed to parse IP:', error);
                return '未知位置'; // 解析失败时返回默认值
            });
            const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知';
            const today = new Date().toISOString().split('T')[0]; // 获取今天的日期

            const filter = {
                ip: clientIP,
                browser: equipment,
                address,
                createdAt: { $gte: new Date(today) } // 在今天之内的记录
            };

            const update = { $inc: { viewNum: 1 } };
            const options = { new: true, upsert: true }; // 如果不存在则创建新记录

            const updatedVisitor = await VisitorsModel.findOneAndUpdate(filter, update, options);

            next();
        } catch (err) {
            next(err);
        }
    }
];

module.exports = visitorsCreate;