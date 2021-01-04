// コンテキストプロバイダを登録する
const request = require('request-promise');
const ORION_URL = process.env.ORION_URL;

function getEntities(){
    let entities = [];
    for(let i=1; i<10000; i++){
        let entity = {
            "id": "jp.opendata-api.kobe.covid-19.Patients."+zeroPadding(i,5),
            "type": "Patients"
        };
        entities.push(entity);
    }
    return entities;
}

function getData(){
    return {
        "description": "Japan Open Data API Context Source",
        "dataProvided": {
            "entities": getEntities(),
            "attrs": ["number", "age", "publishDate", "gender", "profession", "live", "confirmDate", "remarks"]
        },
        "provider": {
            "http": {
                "url": "https://app.mdg.si.i.nagoya-u.ac.jp/cpr/gov/covid-19/kobe-shi/patients"
            }
        }
    }
}

function zeroPadding(num, len){
    return (Array(len).join('0')+num).slice(-len);
}

function registration(){
    return request({
        url: ORION_URL + '/v2/registrations',
        method: 'POST',
        json: getData(),
    });
}

module.exports = registration;