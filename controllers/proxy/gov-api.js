const debug = require('debug')('mdg-context-provider:server');
const Formatter = require('../../lib/formatter');
const request = require('request-promise');
require('dotenv').config();

// 政府 OpenData API
const OPEN_DATA_API_KEY = process.env.OPEN_DATA_API_KEY;
const OPEN_DATA_API_URL = process.env.OPEN_DATA_API_URL;

// 現在orionに登録したコンテキストプロバイダを直接参照するため
// const API_PATHS = {
//     kobe_shi: {
//         patientsList: 'kobe-shi/patients',
//         pedestrianFlowsList: 'kobe-shi/pedestrian-flows',
//         sanrokuBypassTrafficList: 'kobe-shi/sanroku-bypass-traffic',
//         subwayPassengersList: 'kobe-shi/subway-passengers',
//         testCasesList: 'kobe-shi/test-cases'
//     }
// };

// healthチェック用ダミーデータ
const dummyValues = {
    array: ['Bob', 'Alice'],
    boolean: true,
    number: 42,
    structuredValue: {
        somevalue: 'this'
    },
    text: 'Hello. This is Gov API.'
};

// healthチェック。適当に決めた値を返す。
function healthCheck(req, res) {
    debug('Gov API is available - responding with some static values');
    res.status(200).send({
        array: dummyValues.array,
        boolean: dummyValues.boolean,
        number: dummyValues.number,
        structuredValue: dummyValues.structuredValue,
        text: dummyValues.text
    });
}

// 都市名と要求データから，NGSIv2モデルでデータを返却（cPr→orion)
function getAsNGSIv2(req, res) {
    // makeOpenDataAPIRequest(req.params.city, req.params.data)
    makeOpenDataAPIRequest("kobe-shi", "patients")
        .then((result) => {
            const body = JSON.parse(result);
            if (body == null) {
                throw new Error({ message: 'Not Found', statusCode: 404 });
            }
            res.set('Content-Type', 'application/json');

            // bodyをNGSIv2形式に変換する処理が必要
            // その際，パラメータを特定する必要がある
            res.send(body)
        })
        .catch((err) => {
                debug(err);
                res.statusCode = err.statusCode || 501;
                res.send(err);
        });
}

module.exports = {
    healthCheck,
    getAsNGSIv2
};

// CPr→OpenDataAPIへデータをリクエストし返却
function makeOpenDataAPIRequest(city, data){
    return request({
        url: OPEN_DATA_API_URL + '/' + city + '/' + data + '?apikey=' + OPEN_DATA_API_KEY,
        method: 'GET',
    });
}