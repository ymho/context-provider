const _ = require('lodash');
const parseLinks = require('parse-links');
const moment = require('moment');

// 空白を除いた文字列の先頭を大文字にして返却
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

function parseMapping(input) {
    const mappedAttributes = {};

    _.forEach(input.split(','), (element) => {
        if (element.includes(':')) {
            const splitElement = element.split(':');
            mappedAttributes[splitElement[0]] = splitElement[1];
        } else {
            mappedAttributes[element] = element;
        }
    });

    return mappedAttributes;
}

function formatAsV2Response(req, inputData, attributeValueCallback) {
    const mappedAttributes = parseMapping(req.params.mapping);
    const queryResponse = [];
    const addUnitCode = _.indexOf(req.body.metadata, 'unitCode') > -1;
    const addObservedAt = _.indexOf(req.body.metadata, 'observedAt') > -1;

    _.forEach(req.body.entities, (entity) => {
        const element = {
            id: entity.id,
            type: entity.type
        };

        _.forEach(req.body.attrs, (attribute) => {
            if (mappedAttributes[attribute]) {
                element[attribute] = {
                    type: toTitleCase(req.params.type),
                    value: attributeValueCallback(attribute, req.params.type, mappedAttributes[attribute], inputData)
                };

                if (attribute === 'temperature' || attribute === 'relativeHumidity') {
                    if (addUnitCode) {
                        element.metadata = element.metadata || {};
                        if (attribute === 'temperature') {
                            element.metadata.unitCode = 'CEL';
                        } else if (attribute === 'relativeHumidity') {
                            element.metadata.unitCode = 'P1';
                        }
                    }
                    if (addObservedAt) {
                        element.metadata = element.metadata || {};
                        element.metadata.observedAt = moment.utc().format();
                    }
                }
            }
        });

        queryResponse.push(element);
    });
    return queryResponse;
}

module.exports = {
    formatAsV2Response,
    toTitleCase,
    parseMapping
};