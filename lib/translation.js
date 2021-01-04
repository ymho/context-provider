const patients = {
    "number": "番号",
    "age": "年代",
    "publishDate": "確定日",
    "gender": "性別",
    "profession": "職業",
    "live": "居住地",
    "confirmDate": "発症日",
    "remarks": "備考"
};

function translate(attribute){
    return patients[attribute];
}

module.exports = {
    translate
};