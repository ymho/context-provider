const express = require('express');
const router = express.Router();

const GovNGSIProxy = require('../controllers/proxy/gov-api');

// パラメータから都市名cityとデータdataとスキーマを判断（登録はorionあるいはユーザーアプリケーションに委任？）
// 3つのパラメータはOpen Data APIポータルのリファレンスに依拠
router.post(
    '/gov/covid-19/:city/:data/op/query',
    (req, res, next) => {
        req.params.type = 'Text';
        next();
    },
    GovNGSIProxy.getAsNGSIv2
);

// 以下，チュートリアルに載っていた例。
// mappingは A:B
// A: orion側のattribute
// B: provider(API)から返されるJSONのattribute
// 複数ある場合は`,`で区切る。割と密ではないか...?
// ひとまず

// router.post(
//     '/weather/weatherConditions/op/query',
//     (req, res, next) => {
//         req.params.type = 'number';
//         req.params.mapping = 'temperature:temp,relativeHumidity:humidity';
//         req.params.queryString = 'berlin,de';
//         next();
//     },
//     WeatherNGSIProxy.getAsNGSIv2
// );

module.exports = router;