const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const pregnancyOutcomeList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/pregnancyOutcomes.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('PREGNANCY_OUTCOMES').del()
        .then(function () {
            // Inserts seed entries
            return knex('PREGNANCY_OUTCOMES').insert(pregnancyOutcomeList);
        });
};