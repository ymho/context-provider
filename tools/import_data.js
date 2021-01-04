// コンテキストプロバイダを登録する

function getEntities(){
    let entities = [];
    for(let i=1; i<10000; i++){
        entity = {
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

module.exports = getData;