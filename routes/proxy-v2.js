const express = require('express');
const router = express.Router();

const GovNGSIProxy = require('../controllers/proxy/gov-api');

/* 有効なクエリ
Supported NGSI-v2 context provider endpoints

`/gov/covid-19/kobe-shi/patients/`

*/

// bodyから都市名とデータを判断（登録はorionあるいはユーザーアプリケーションに委任？）
router.post('/gov/covid-19/op/query', GovNGSIProxy.getAsNGSIv2);

module.exports = router;