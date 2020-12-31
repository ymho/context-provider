const express = require('express');
const router = express.Router();

const GovNGSIProxy = require('../controllers/proxy/gov-api');

router.get('/gov', GovNGSIProxy.healthCheck);

// パラメータの指定がない場合，有効なパラメータを表示する
router.get('/', (req, res) => {
    res.status(200).send({
        health_urls: ['/health/gov']
    });
});

module.exports = router;