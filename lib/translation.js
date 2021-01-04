const patients = {
    "番号": "number",
    "年代": "age",
    "発表日": "publishDate",
    "性別": "gender",
    "職業": "profession",
    "居住地": "live",
    "確定日": "confirmDate",
    "備考": "remarks",
}

function translate(attribute){
    return patients[attribute];
}

module.exports = {
    translate
};