const debug = require('debug')('mdg-context-provider:server');
const request = require('request-promise');
const Translation = require('../../lib/translation');
const _ = require('lodash');
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
    makeOpenDataAPIRequest(req.params.city, req.params.data)
        .then((result) => {
            const body = JSON.parse(result);
            if (body == null) {
                throw new Error({ message: 'Not Found', statusCode: 404 });
            }
            res.set('Content-Type', 'application/json');
            // bodyをNGSIv2形式に変換する処理が必要
            // その際，パラメータを特定する必要がある
            res.send(formatAsV2Response(req,body));
        })
        .catch((err) => {
                debug(err);
                res.statusCode = err.statusCode || 501;
                res.send(err);
        });
}

// CPr→OpenDataAPIへデータをリクエストし返却
function makeOpenDataAPIRequest(city, data){
    return request({
        url: OPEN_DATA_API_URL + '/' + city + '/' + data + '?apikey=' + OPEN_DATA_API_KEY,
        method: 'GET',
    });
}

// 空白を除いた文字列の先頭を大文字にして返却
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

// DataFormatter
// req: idやname，paramsが含まれるリクエスト
// inputData: 外部APIから取得したデータオブジェクト
function formatAsV2Response(req, inputData){
    // console.log(inputData)
    // const schema = req.params.schema;
    const queryResponse = [];
    // 各エンティティに対して
    _.forEach(req.body.entities, (entity) => {
        const element = {
            id: entity.id,
            type: entity.type
        };
        // 各アトリビュートに対して
        _.forEach(req.body.attrs, (attribute) => {
            // attribute要素を追加
            index = (element.id).substring((element.id).lastIndexOf(".")+1);
            if(attribute in inputData[index] && Translation.translate(attribute)){
                element[Translation.translate(attribute)] = {
                    type: toTitleCase(req.params.type),
                    // id番目のschemaの値をvalueとする
                    value: inputData[index][attribute]
                }
            }else {
                console.log("リクエストに存在しないアトリビュート<"+attribute+">が含まれているか参照範囲を超えています");
            }
        });
        queryResponse.push(element);
    });
    return queryResponse;
}

module.exports = {
    healthCheck,
    getAsNGSIv2,
};